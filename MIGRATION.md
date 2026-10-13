# Next.js 전환 기록

작성일: 2026-10-14 (한국 시간)

## 기준 소스

- 특전록 공개 사이트 버전 17
- 기준 커밋: `d215b08140408154ed0937a9381bef39e2c2065b`
- 기존 원페이지 스크롤·모바일 고정 헤더·단일 메뉴 버튼 수정 반영

## 변경 사항

- Next.js 16.3.4, React 19.2.6, TypeScript 5.9.3 기반의 독립 프로젝트로 정리
- `next dev`, `next build`, `next start` 기본 명령 사용
- npm용 `package-lock.json` 포함, `npm ci`로 의존성 설치 검증
- Vinext, Vite, Wrangler, Cloudflare 타입·DB 바인딩·Sites 배포 플러그인과 미사용 인증/커넥터 코드 제외
- 사용 중인 UI 컴포넌트와 스타일, 로고·이미지·폰트 유지
- 사이트 운영 주소를 `NEXT_PUBLIC_SITE_URL`로 통합, 기존 호스팅 주소 고정값 제거
- 44개 읽기 경로를 `generateStaticParams`로 빌드 시 생성, 잘못된 경로는 404
- 통계는 기본 비활성화. 선택적으로 Supabase SQL 함수에 익명 누적 횟수 기록
- Next.js 내부 요청 URL과 외부 Host/전달 프로토콜의 차이를 통계 API에 반영
- 통계 비활성화 상태를 개인정보 안내 화면에 표시
- Vercel 설정, 환경변수 예시, SQL, 한국어 설치·배포 안내와 검사 스크립트 포함

## 실행한 검사

검증 환경: Linux, Node.js 24.19.0. 안내에서는 Node.js 22 LTS를 사용하며 package.json은 22.13 이상~25 미만을 허용함.

| 검사 | 결과 |
| --- | --- |
| `npm ci --no-audit --no-fund` | 의존성 설치 완료 |
| `npm run typecheck` | 통과 |
| `npm test` | 검색·분류·출처 연결·44개 페이지 렌더링·메뉴·원페이지 구조·스크롤 이벤트 검사 통과 |
| `npm run build` | 기본 Turbopack 빌드·타입 검사·44개 SSG 읽기 경로 생성 통과 |
| `npm run test:http` | Next.js 운영 서버에서 홈·44개 읽기 경로·404·API·안내 페이지·자산·사이트맵 46개 응답 검사 통과 |
| 통계 어댑터 모의 HTTP 검사 | 정상 기록, 비활성화, 저장 실패, DNT/GPC, 외부 Origin 거부, 프록시 Host 처리 검사 통과 |
| 도메인 설정 검사 | 지정한 운영 주소로 사이트맵·robots 생성 확인 |

## 아직 검증하지 않은 범위

- 사용자의 Vercel 계정에서 실제 배포
- 실제 Supabase 프로젝트에서 SQL 실행·저장·권한 확인
- 휴대폰·PC 브라우저에서 터치·클릭·스크롤·모달·공유 동작과 시각적 확인
- Windows에서 의존성 설치와 실행 (검사 스크립트의 디렉터리 연결은 Windows junction 대응 포함)
- ESLint 전체 검사

기존 Cloudflare D1 통계 데이터는 포함하지 않았다. 관리자 화면·CMS·로그인은 새로 추가하지 않았다. 기존 공개 사이트의 코드나 배포는 이번 전환 작업에서 변경하지 않았다.

## 패키지 구성

전체 앱 소스, 사용 중인 UI 컴포넌트, 23개 공개 자산, 설정과 환경변수 예시, 의존성 잠금 파일, 통계 SQL, 검사 스크립트와 문서를 포함한다.

`node_modules`, `.next`, 실제 환경변수 파일, Git 저장소 정보, 기존 호스팅 식별/인증 정보와 DB 데이터는 ZIP에 포함하지 않는다.
