## Tech Stack

### Frontend
- Next.js 16 (App Router), TypeScript strict, MDX
- TailwindCSS v4, shadcn/ui, Framer Motion
- Recharts (Chart), lucide-react (Icons)
- @supabase/ssr, @supabase/auth-helpers-nextjs (Authentication)

### Backend
- Next.js 16 (API Routes), TypeScript strict, Supabase

### Infra
- Supabase
    - Storage (Images, Backups)
    - Realtime (Realtime Metrics)
    - Database (PostgreSQL)
    - RLS (Row Level Security)

## Rules
- 기획서/리포트에 가정치 금지. 실측 데이터만, 모르면 TBD 표시
- 파일 삭제 전 반드시 확인 요청
- 커밋 메시지는 영어로, conventional commits 형식

## Testing
- pnpm test (unit), pnpm test:e2e (integration)
- 테스트 없이 PR 올리지 않기
- eslint 검사를 통과하도록 코드 포맷팅 하기