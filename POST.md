# 랜딩 페이지 성능 최적화 — 이벤트 위임, CSS 변수, Map, rAF

> 실제 운영 중인 블로그 랜딩 페이지에서 발견한 네 가지 성능 문제를 개선한 기록입니다.
> React Compiler(Next.js 16)가 자동 메모이제이션을 처리해주는 환경을 전제로 합니다.

---

## 1. InteractiveGrid — 960개 이벤트 핸들러 → 1개 (이벤트 위임)

### 문제

히어로 섹션 배경에 있는 인터랙티브 그리드는 40×24 = **960개의 SVG `<rect>`** 로 구성됩니다.
기존 코드는 각 rect마다 `onMouseEnter` 핸들러를 붙였습니다.

```tsx
// 변경 전
{Array.from({ length: rows * cols }).map((_, i) => {
  const x = i % cols;
  const y = Math.floor(i / cols);
  return (
    <rect
      key={`${x},${y}`}
      x={x * width}
      y={y * height}
      width={width}
      height={height}
      className={isLit ? "igrid-cell is-lit" : "igrid-cell"}
      style={{ animationDuration: `${fadeMs}ms` }}  // 960번 반복
      onMouseEnter={() => hit(x, y)}                // 960개 핸들러
    />
  );
})}
```

**두 가지 낭비가 동시에 존재합니다.**

- 브라우저는 960개의 이벤트 리스너를 각각 DOM 노드에 등록하고 메모리에 유지합니다.
- `style={{ animationDuration: '1100ms' }}` 가 960번 반복되지만 값은 항상 동일합니다.

### 해결 — 이벤트 위임 (Event Delegation)

이벤트 위임은 자식 요소 대신 **공통 조상 하나에 핸들러를 붙이고**, 이벤트가 버블링되어 올라올 때 어느 자식에서 발생했는지 좌표로 계산하는 패턴입니다.

SVG의 경우 `onMouseMove` 하나를 최상위 `<svg>`에 달고, 마우스 위치에서 셀 좌표를 역산합니다.

```tsx
// 변경 후
const lastCell = useRef<string | null>(null);

const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
  const svg = e.currentTarget;
  const rect = svg.getBoundingClientRect();
  const cellX = Math.floor((e.clientX - rect.left) / width);
  const cellY = Math.floor((e.clientY - rect.top) / height);

  if (cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows) {
    const key = `${cellX},${cellY}`;
    if (key !== lastCell.current) {  // 같은 셀이면 스킵
      lastCell.current = key;
      hit(cellX, cellY);
    }
  }
};

const handleMouseLeave = () => {
  lastCell.current = null;
};
```

`onMouseMove`는 픽셀 단위로 연속 발생하므로, `useRef`로 마지막으로 처리한 셀을 기억해 **셀이 바뀔 때만** 상태 업데이트가 일어나도록 합니다. 동작은 기존 `onMouseEnter`와 완전히 동일하지만 이벤트 리스너는 **960개 → 2개**입니다.

### 해결 — CSS 변수로 인라인 스타일 제거

`animationDuration`은 960개 rect에서 값이 동일하므로, CSS 변수를 부모 SVG에 한 번 설정하고 CSS에서 상속받으면 됩니다.

```tsx
// SVG에 한 번만 설정
<svg
  style={{ "--igrid-fade": `${fadeMs}ms` } as React.CSSProperties}
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
>
  {/* rect들에서 style 속성 완전 제거 */}
  <rect className={isLit ? "igrid-cell is-lit" : "igrid-cell"} />
</svg>
```

```css
/* CSS — 이미 --igrid-fade 변수를 참조하도록 되어 있었음 */
.igrid-cell.is-lit {
  animation: igrid-fade var(--igrid-fade, 1100ms) ease-out forwards;
}
```

React는 렌더링 시 인라인 스타일을 직렬화해 DOM에 쓰는 비용이 발생합니다. 이 작업이 960번 → 1번으로 줄어듭니다.

---

## 2. TechStackSection — O(n²) indexOf → O(1) Map 조회

### 문제

기술 스택 타일에 순서 번호(01, 02 …)를 표시할 때, 필터링된 배열을 순회하면서 원본 배열에서 indexOf로 인덱스를 찾고 있었습니다.

```tsx
// 변경 전
{visible.map((t, i) => (
  <div className="stack-tile__num">
    {String(STACK.indexOf(t) + 1).padStart(2, "0")}
    {/* visible.map O(n) × indexOf O(n) = O(n²) */}
  </div>
))}
```

`visible`이 최대 16개 아이템이라 실제 영향은 미미하지만, **알고리즘 수준의 문제**입니다. 리스트가 길어질수록 비용이 제곱으로 증가합니다.

### 해결 — 모듈 레벨 Map으로 O(1) 조회

```tsx
// 모듈 레벨에서 한 번만 계산 (앱 생애주기 동안 재계산 없음)
const STACK_INDEX = new Map(STACK.map((item, i) => [item, i + 1]));

// 렌더링 시 O(1) 조회
{visible.map((t) => (
  <div className="stack-tile__num">
    {String(STACK_INDEX.get(t)).padStart(2, "0")}
  </div>
))}
```

`Map`은 해시 기반이므로 조회 비용이 O(1)입니다. 데이터 배열이 모듈 레벨 상수이므로 Map도 모듈 레벨에서 한 번만 생성되고, 이후 렌더링에서는 조회만 합니다.

---

## 3. AboutSection — setTimeout 애니메이션 루프 → requestAnimationFrame

### 문제

숫자가 0에서 목표값까지 올라가는 카운트업 애니메이션을 `setTimeout(tick, 16)`으로 구현하고 있었습니다.

```tsx
// 변경 전
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = Date.now();
    let id: ReturnType<typeof setTimeout>;

    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));

      if (t < 1) {
        id = setTimeout(tick, 16); // ~60fps를 흉내냄
      }
    };
    tick();

    return () => clearTimeout(id);
  }, [target, duration]);

  return value;
}
```

`setTimeout(fn, 16)`은 약 60fps를 흉내 내려는 의도지만 두 가지 문제가 있습니다.

1. **정밀도 부재**: `setTimeout`의 지연은 보장되지 않습니다. 브라우저 탭이 백그라운드에 있거나, 메인 스레드가 바쁘면 16ms보다 늦게 실행됩니다. 이 경우 `Date.now()` 기반 경과 시간 계산이 틀어져 애니메이션이 버벅입니다.
2. **프레임 불일치**: 디스플레이 주사율이 90Hz, 120Hz이면 실제 프레임 간격은 11ms, 8ms입니다. `setTimeout(16)`은 이 경우 프레임을 건너뜁니다.

### 해결 — requestAnimationFrame

```tsx
// 변경 후
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now(); // Date.now()보다 정밀한 고해상도 타임스탬프
    let rafId: number;

    const tick = (now: number) => {  // rAF가 현재 시각을 직접 전달
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [target, duration]);

  return value;
}
```

`requestAnimationFrame`은 브라우저가 **다음 화면 갱신 직전**에 콜백을 호출합니다.

- 콜백 인자로 `DOMHighResTimeStamp`를 전달하므로 `Date.now()` 대신 그것을 쓰면 됩니다.
- 탭이 비활성화되면 자동으로 일시정지됩니다. (불필요한 연산 방지)
- 디스플레이 주사율(60Hz / 120Hz / 144Hz)에 자동으로 맞춥니다.

---

## 정리

| 파일 | 문제 | 해결 | 규칙 |
|---|---|---|---|
| `interactive-grid.tsx` | 960개 이벤트 리스너 | 이벤트 위임 — SVG 1개에 `onMouseMove` | `js-set-map-lookups`, `rerender-use-ref-transient-values` |
| `interactive-grid.tsx` | 960개 동일한 인라인 스타일 | CSS 변수를 부모에 한 번 설정 | `rendering-hoist-jsx` |
| `tech-stack-section.tsx` | `indexOf` O(n²) | 모듈 레벨 `Map`으로 O(1) | `js-index-maps` |
| `about-section.tsx` | `setTimeout` 애니메이션 루프 | `requestAnimationFrame` | `js-cache-function-results` |

### 공통 원칙

- **반복 횟수 × 비용** 을 먼저 계산한다. 작은 비용도 960번이면 크다.
- **변하지 않는 값은 한 번만 계산한다.** 모듈 레벨 상수, CSS 변수 상속이 그 수단이다.
- **브라우저 API는 목적에 맞게 쓴다.** 애니메이션에는 `rAF`, 입력 지연에는 `setTimeout`.
- **이벤트는 가능한 한 조상에 위임한다.** 리스트가 길수록 이득이 크다.
