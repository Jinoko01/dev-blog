# 🌐 백준 23300번: 웹 브라우저 2 풀이 및 해설

## 💡 문제 접근 방식
이 문제는 웹 브라우저의 **뒤로 가기, 앞으로 가기, 접속, 압축** 기능을 시뮬레이션하는 문제입니다. 
핵심은 **스택(Stack)** 자료구조를 활용하여 방문 기록을 관리하는 것입니다. 이 코드에서는 자바의 내장 `Stack` 클래스를 사용하는 대신, **크기가 넉넉한 배열과 인덱스 포인터(`Top`)를 사용해 스택을 직접 구현**하여 메모리와 속도를 최적화했습니다.

---

## 🏗️ 주요 변수 설명
* `current`: 현재 보고 있는 웹 페이지의 번호입니다. (초기값: 방문한 페이지가 없으므로 `-1`)
* `back[]`, `backTop`: **뒤로 가기 공간**을 담당하는 배열 스택과 그 최상단 인덱스입니다.
* `forward[]`, `forwardTop`: **앞으로 가기 공간**을 담당하는 배열 스택과 그 최상단 인덱스입니다.
> **참고:** 문제에서 주어지는 최대 명령의 수(Q)는 100개이므로, 배열의 크기를 2,000으로 잡은 것은 공간 초과(Overflow)를 완벽히 방지하는 안전한 설정입니다.

---

## ⚙️ 기능별 로직 해설

### 1. 🆕 새로운 페이지 접속 (`A`)
```java
// 처음 방문하는 페이지라면 current만 설정
if (current == -1) {
    current = number;
    break;
}
// 현재 페이지를 뒤로 가기 기록에 저장
back[++backTop] = current;
// 새 페이지로 이동
current = number;
// 새 페이지에 접속하면 앞으로 가기 기록은 모두 삭제
forwardTop = -1;
```
- **동작**: 현재 페이지를 '뒤로 가기' 공간에 넣고, 새로운 페이지를 `current`로 갱신합니다.

- **포인트**: 새로운 페이지로 이동했으므로 미래의 기록인 앞으로 가기 공간을 모두 초기화(`forwardTop = -1`) 합니다.

### 2. ⬅️ 뒤로 가기 (B)

```java
// 뒤로 갈 페이지가 없으면 무시
if (backTop == -1) break;

// 현재 페이지는 앞으로 가기 기록에 저장
forward[++forwardTop] = current;

// 뒤로 가기 스택의 맨 위 페이지로 이동
current = back[backTop--];
```
- **동작**: '뒤로 가기' 공간에 기록이 있다면, 현재 페이지를 '앞으로 가기' 공간으로 넘깁니다.

- **포인트**: `back[backTop--]`을 통해 스택의 가장 위에 있는 최신 기록을 꺼내와 `current`로 만듭니다.

### 3. ➡️ 앞으로 가기 (F)

```java
// 앞으로 갈 페이지가 없으면 무시
if (forwardTop == -1) break;

// 현재 페이지는 뒤로 가기 기록에 저장
back[++backTop] = current;

// 앞으로 가기 스택의 맨 위 페이지로 이동
current = forward[forwardTop--];
```
- **동작**: 로직은 '뒤로 가기'와 완벽히 반대입니다. `forward`의 가장 최신 기록을 빼서 `current`로 만들고, 기존 페이지는 `back`에 넣습니다.

### 4. 🗜️ 압축 (C)

```java
int[] newBack = new int[2000];
int newBackTop = -1;

for (int i = 0; i <= backTop; i++) {
    if (newBackTop == -1) { // 첫 원소
        newBack[++newBackTop] = back[i];
        continue;
    }
    if (newBack[newBackTop] == back[i]) continue; // 연속 중복 스킵
    
    newBack[++newBackTop] = back[i]; // 다른 값이면 추가
}
back = newBack;
backTop = newBackTop;
```
- **동작**: '뒤로 가기' 공간에서 연속으로 같은 페이지 번호가 나타나면 하나만 남깁니다.

- **포인트**: 새로운 배열(`newBack`)을 만들고, 가장 오래된 기록(`i = 0`)부터 차례대로 확인합니다. 방금 `newBack`에 넣은 값과 현재 검사하는 값이 다를 때만 배열에 추가합니다. 완료 후 기존 배열을 교체합니다.

---

## 🖨️ 결과 출력

```java
// 뒤로 가기 기록 출력 (최근 페이지부터 출력)
if (backTop == -1) {
    sb.append(-1).append('\n');
} else {
    for (int i = backTop; i >= 0; i--) {
        sb.append(back[i]).append(' ');
    }
    sb.append('\n');
}
```

- 마지막으로 `current`, `back` 기록, `forward` 기록을 문제의 요구사항에 맞게 출력합니다.

- 스택 특성상 가장 최근에 방문한 페이지부터 출력해야 하므로 `Top` 인덱스부터 `0`까지 역순으로 반복문을 순회하는 것이 핵심입니다. 기록이 비어 있다면 `-1`을 출력합니다.