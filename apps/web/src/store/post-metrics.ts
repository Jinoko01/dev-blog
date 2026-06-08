import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { incrementPostLike, decrementPostLike } from "@/lib/api";

type LikesState = {
  likes: number;
  isLiked: boolean;
  isPending: boolean;
};

/**
 * slug별 likes 상태 atom. slug가 다르면 독립된 인스턴스가 생성된다.
 */
export const likesAtomFamily = atomFamily((_slug: string) =>
  atom<LikesState>({ likes: 0, isLiked: false, isPending: false }),
);

/**
 * 서버에서 받은 initialLikes로 atom을 초기화하는 write-only atom.
 * likes === 0 && !isLiked 인 경우(초기 상태)에만 덮어쓴다.
 */
export const initLikesAtom = atom(
  null,
  (
    get,
    set,
    { slug, initialLikes }: { slug: string; initialLikes: number },
  ) => {
    const current = get(likesAtomFamily(slug));
    if (current.likes === 0 && !current.isLiked) {
      const isLiked =
        typeof window !== "undefined"
          ? Boolean(localStorage.getItem(`liked_${slug}`))
          : false;
      set(likesAtomFamily(slug), {
        likes: initialLikes,
        isLiked,
        isPending: false,
      });
    }
  },
);

/**
 * 좋아요 토글 액션. 낙관적 업데이트 후 API 호출, 실패 시 롤백.
 */
export const toggleLikeAtom = atom(null, async (get, set, slug: string) => {
  const state = get(likesAtomFamily(slug));
  if (state.isPending) return;

  const wasLiked = state.isLiked;
  const nextLiked = !wasLiked;

  // 낙관적 업데이트
  set(likesAtomFamily(slug), {
    likes: state.likes + (nextLiked ? 1 : -1),
    isLiked: nextLiked,
    isPending: true,
  });

  if (nextLiked) {
    localStorage.setItem(`liked_${slug}`, "true");
  } else {
    localStorage.removeItem(`liked_${slug}`);
  }

  try {
    const data = wasLiked
      ? await decrementPostLike(slug)
      : await incrementPostLike(slug);

    set(likesAtomFamily(slug), {
      likes: data.likes,
      isLiked: nextLiked,
      isPending: false,
    });
  } catch {
    // 롤백
    set(likesAtomFamily(slug), {
      likes: state.likes,
      isLiked: wasLiked,
      isPending: false,
    });
    if (wasLiked) {
      localStorage.setItem(`liked_${slug}`, "true");
    } else {
      localStorage.removeItem(`liked_${slug}`);
    }
  }
});
