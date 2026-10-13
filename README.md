# 특전록 · Next.js 개발 프로젝트

현재 특전록의 디자인, 원페이지 스크롤, 모바일 메뉴, 검색, 연표, 역할 필터, 상세 모달과 44개 읽기 페이지를 유지한 Vercel용 소스입니다.

## 1. 내 컴퓨터에서 실행

Node.js 22 LTS를 설치합니다. ZIP을 풀고 **package.json이 있는 teukjeonrok-nextjs 폴더**를 VS Code에서 엽니다. 터미널에서 실행합니다.

```sh
npm ci
npm run dev
```

브라우저에서 http://localhost:3000 을 엽니다. 개발 서버 종료는 `Ctrl+C`입니다.

환경변수를 수정하려면 `.env.example`을 `.env.local`이라는 이름으로 복사합니다. 통계가 필요 없다면 환경변수 없이도 실행·배포할 수 있습니다.

## 2. 배포 전 검사

```sh
npm run typecheck
npm test
npm run build
```

실제 빌드 결과를 HTTP로 점검하려면 빌드 후 실행합니다. 이 검사는 서버를 잠시 시작하고 모든 읽기 페이지, 404, API, 자산을 확인한 뒤 종료합니다.

```sh
npm run test:http
```

브라우저에서 빌드 결과를 직접 보려면 `npm start` 후 http://localhost:3000 을 엽니다.

## 3. GitHub → Vercel 배포

1. GitHub에 새 저장소를 만들고 프로젝트 소스를 올립니다. `node_modules`, `.next`, `.env.local`은 올리지 않습니다. `.gitignore`와 `.env.example`은 포함합니다.
2. Vercel에서 **Add New → Project**로 저장소를 가져옵니다.
3. **Framework Preset: Next.js**를 선택합니다.
4. **Root Directory**는 `package.json`이 있는 폴더로 선택합니다. 저장소 루트에 소스를 올렸다면 기본값입니다.
5. **Build Command: npm run build**, **Install Command: npm ci**. Output Directory는 Next.js 기본값을 유지합니다.
6. Node.js 버전은 **22.x**로 설정합니다.
7. 통계가 필요 없다면 `NEXT_PUBLIC_ENABLE_METRICS=false`로 두고 **Deploy**합니다. 기본값도 꺼짐입니다.
8. 발급받은 `https://프로젝트명.vercel.app` 주소 또는 연결한 도메인을 `NEXT_PUBLIC_SITE_URL`에 입력하고 다시 배포합니다.

`NEXT_PUBLIC_SITE_URL`을 생략하면 Vercel이 제공하는 프로젝트 운영 주소를 사용합니다. 로컬에서는 `http://localhost:3000`을 사용합니다. 공식 운영 주소를 직접 지정하면 canonical, 사이트맵, robots, 구조화 데이터, 공유 썸네일 주소를 같은 기준으로 맞출 수 있습니다. Preview에서도 canonical은 지정한 운영 도메인을 사용합니다.

Vercel 프로젝트는 이 파일을 준비하는 과정에서 생성하거나 배포하지 않았습니다. 실제 Vercel 업로드 후 배포 로그와 휴대폰 화면을 확인해야 합니다.

## 4. 통계 기능 선택 사항

기본값은 **꺼짐**입니다. DB가 없어도 검색·글 읽기·메뉴·공유 기능을 사용할 수 있습니다. 꺼진 상태에서는 브라우저가 집계 API에 요청하지 않습니다.

기존 Cloudflare D1 대신, 선택적으로 Supabase의 PostgreSQL을 연결할 수 있도록 서버 코드를 포함했습니다. 별도 SDK 없이 서버의 HTTP 요청으로 SQL 함수를 호출합니다.

1. 본인의 Supabase 프로젝트를 준비합니다.
2. SQL Editor에서 `database/metrics.sql` 전체를 실행합니다.
3. Vercel의 **Production** 환경변수에 다음 값을 설정합니다.

| 변수 | 값 |
| --- | --- |
| `NEXT_PUBLIC_ENABLE_METRICS` | `true` |
| `SUPABASE_URL` | 본인 Supabase 프로젝트의 HTTPS 주소 |
| `SUPABASE_SECRET_KEY` | 서버용 `sb_secret_...` 키 |
| `NEXT_PUBLIC_SITE_URL` | 사이트 운영 주소 |

4. 다시 배포합니다. 공개 환경변수는 빌드할 때 반영되므로 값을 바꾸면 재배포가 필요합니다.
5. 사이트에서 페이지·메뉴를 사용한 뒤 Supabase Table Editor의 `metric_counts`에서 누적 횟수를 확인합니다.

`SUPABASE_SECRET_KEY`는 서버에서만 사용합니다. 변수 이름에 `NEXT_PUBLIC_`을 붙이거나 소스에 키를 적지 마세요. SQL은 공개·로그인 사용자에게 통계 테이블과 함수 접근을 허용하지 않으며, 서버 역할에만 필요한 권한을 부여합니다.

한국 시간 날짜·행동 종류·정해진 항목·횟수만 저장합니다. 검색어 원문, 방문자 IP, 이메일, 쿠키, 기기 식별자는 저장하지 않으며 DNT/GPC 거부 신호를 따릅니다. UV 대신 이용 횟수 집계입니다. 호스팅 서비스의 기본 로그는 별개입니다. 통계 저장 실패는 콘텐츠 열람을 막지 않습니다.

기존 D1 통계는 자동으로 옮겨지지 않습니다. 새 DB는 빈 통계로 시작합니다. 기존 누적 자료를 이전하려면 별도의 데이터 내보내기·가져오기 작업이 필요합니다. 실제 Supabase 계정 연결과 DB SQL 실행은 이 패키지 작업에 포함되지 않았습니다. Preview 배포는 집계 설정을 꺼두는 것을 권장합니다.

## 5. 어디를 수정하나요?

| 파일 | 수정할 내용 |
| --- | --- |
| `app/Archive.tsx` | 메인 화면과 섹션 구성 |
| `app/archive.css`, `app/reading.css` | 메인·읽기 화면 스타일 |
| `app/MobileMenu.tsx`, `app/mobile-menu.css` | 모바일 메뉴와 고정 헤더 |
| `app/useSectionScroll.ts` | 메뉴를 통한 섹션 이동 |
| `app/archive-data.ts` | 전문 전력·이미지·기본 출처 |
| `app/history-data.ts` | 역사 연표와 추가 출처 |
| `app/archive-index.ts` | 통합 검색·44개 읽기 페이지 데이터 |
| `app/revision-data.ts` | 화면 업데이트 기록 |
| `lib/site-config.ts` | 사이트 주소 설정 |
| `lib/metrics-store.ts`, `database/metrics.sql` | 선택적 통계 저장 |
| `public/assets` | 로고·이미지·폰트 |

글은 현재 코드 파일로 관리합니다. 관리자 글쓰기 화면, 로그인, CMS는 포함하지 않았습니다. 새 글을 코드에 추가하면 검색·읽기 경로·사이트맵에 반영됩니다. 새 페이지 생성과 운영 주소 변경은 빌드·재배포가 필요합니다.

## 6. 직접 확인할 항목

- 휴대폰에서 스크롤한 상태로 메뉴 열기·닫기와 햄버거/X 위치 확인
- 각 메뉴 선택 후 섹션 시작점이 헤더 아래에 오는지 확인
- 짧은 섹션에서 앞뒤 영역이 비치지 않는지 확인
- 검색, 역할 필터, 연표 선택, 모달 열기·닫기 확인
- 읽기 페이지 주소 직접 열기·새로고침·뒤로가기·공유 확인
- 도메인·공유 썸네일·사이트맵 주소와 선택적 통계 저장 확인

자동 검사 범위와 이번 검증 결과는 `MIGRATION.md`에 기록했습니다. 실제 모바일 브라우저 조작 검증은 별도로 필요합니다.

## 참고 문서

- Next.js 설치·기본 명령: https://nextjs.org/docs/app/getting-started/installation
- Vercel Next.js 배포: https://vercel.com/docs/frameworks/full-stack/nextjs
- Supabase 서버용 키: https://supabase.com/docs/guides/getting-started/api-keys
- Supabase SQL 함수: https://supabase.com/docs/guides/database/functions
