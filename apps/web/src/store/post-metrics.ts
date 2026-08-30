import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { incrementPostLike, decrementPostLike } from "@/lib/api";

type LikesState = {
  likes: number;
  isLiked: boolean;
  isPending: boolean;
  isInitialized: boolean;
};

/**
 * slug별 likes 상태 atom. slug가 다르면 독립된 인스턴스가 생성된다.
 */
export const likesAtomFamily = atomFamily((slug: string) => {
  const likesAtom = atom<LikesState>({
    likes: 0,
    isLiked: false,
    isPending: false,
    isInitialized: false,
  });
  likesAtom.debugLabel = `likes:${slug}`;
  return likesAtom;
});

/**
 * 서버에서 받은 initialLikes로 atom을 한 번만 초기화하는 write-only atom.
 */
export const initializeLikesAtom = atom(
  null,
  (
    get,
    set,
    { slug, initialLikes }: { slug: string; initialLikes: number },
  ) => {
    const current = get(likesAtomFamily(slug));
    if (!current.isInitialized) {
      const isLiked =
        typeof window !== "undefined"
          ? Boolean(localStorage.getItem(`liked_${slug}`))
          : false;
      set(likesAtomFamily(slug), {
        likes: initialLikes,
        isLiked,
        isPending: false,
        isInitialized: true,
      });
    }
  },
);

/** 조회수 증가 응답에 포함된 최신 likes를 동기화하는 write-only atom. */
export const syncLikesAtom = atom(
  null,
  (get, set, { slug, likes }: { slug: string; likes: number }) => {
    const current = get(likesAtomFamily(slug));
    if (current.isPending) {
      return;
    }

    set(likesAtomFamily(slug), {
      ...current,
      likes,
      isInitialized: true,
    });
  },
);

/**
 * 좋아요 토글 액션. 낙관적 업데이트 후 API 호출, 실패 시 롤백.
 */
export const toggleLikeAtom = atom(null, async (get, set, slug: string) => {
  const state = get(likesAtomFamily(slug));
  if (state.isPending) {
    return;
  }

  const wasLiked = state.isLiked;
  const nextLiked = !wasLiked;

  // 낙관적 업데이트
  set(likesAtomFamily(slug), {
    likes: state.likes + (nextLiked ? 1 : -1),
    isLiked: nextLiked,
    isPending: true,
    isInitialized: true,
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
      isInitialized: true,
    });
  } catch {
    // 롤백
    set(likesAtomFamily(slug), {
      likes: state.likes,
      isLiked: wasLiked,
      isPending: false,
      isInitialized: true,
    });
    if (wasLiked) {
      localStorage.setItem(`liked_${slug}`, "true");
    } else {
      localStorage.removeItem(`liked_${slug}`);
    }
  }
});
