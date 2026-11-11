# 제로투헌잇 ZERO to HUNNIT — 회사 홈페이지

GitHub Pages로 바로 올릴 수 있는 정적 사이트입니다. 빌드 과정은 없어요.

## 폴더 구조

```
index.html            ← 페이지 본문 (섹션 문구 수정)
404.html              ← 없는 주소로 들어왔을 때 보이는 페이지
.nojekyll             ← GitHub Pages가 파일을 그대로 쓰도록 하는 빈 파일
assets/
  css/style.css       ← 디자인 (색상은 맨 위 :root 에서 변경)
  js/data.js          ← ★ 실적·통계·컨설팅 사례·문의 폼 설정 (자주 수정하는 파일)
  js/main.js          ← 동작 스크립트 (수정할 일 거의 없음)
  img/                ← 이미지 넣는 곳 (아래 목록 참고)
```

## GitHub Pages 배포

1. GitHub에서 새 저장소 만들기 (예: `zerotohunnit`, Public)
2. 이 폴더 안의 파일 전체를 저장소 루트에 업로드 (`Add file → Upload files`)
3. `Settings → Pages → Build and deployment`
   - Source: **Deploy from a branch**
   - Branch: **main** / **/(root)** → Save
4. 1~2분 뒤 `https://<깃허브아이디>.github.io/zerotohunnit/` 에서 확인

### 도메인 연결 (선택)
`Settings → Pages → Custom domain` 에 도메인 입력 후, 도메인 업체 DNS에
- 루트 도메인: A 레코드 `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- www: CNAME `<깃허브아이디>.github.io`

## 이미지 넣기

`assets/img/` 에 아래 파일명으로 넣으면 자동으로 표시됩니다. 없으면 빗금 박스에 파일명이 보여요.

| 파일명 | 용도 | 권장 비율 |
| --- | --- | --- |
| `profile.jpg` | 대표 프로필 사진 | 4:5 (세로) |
| `lecture-01.jpg` ~ `lecture-04.jpg` | 강의 현장 사진 | 4:3 |
| `case-kidc.jpg`, `case-gcs.jpg`, `case-koica.jpg` | 노션 업무 시스템 사례 화면 | 16:10 |
| `case-homepage-01.jpg`, `case-homepage-02.jpg` | 홈페이지 사례 화면 | 16:10 |
| `case-portfolio-01.jpg`, `case-portfolio-02.jpg` | 포트폴리오 사례 화면 | 16:10 |
| `og-image.jpg` | 카톡·SNS 공유 썸네일 | 1200×630 |
| `logo.svg` (선택) | 로고 — `index.html` 상단 주석 참고 | — |

이미지는 장당 500KB 이하로 줄여서 올리면 빠르게 열립니다. 사진 캡션은 `index.html` 의 `강의 현장` 부분에서 수정하세요.

## 문의 폼

기본값은 **메일 앱 연결 방식**입니다(작성 내용이 이메일 본문에 자동으로 채워짐).
페이지에서 바로 전송되게 하려면:

1. [Formspree](https://formspree.io) 가입 → New Form → 받는 이메일 설정
2. 발급된 주소(`https://formspree.io/f/xxxx`)를 `assets/js/data.js` 의 `formEndpoint` 에 붙여넣기

## 실적 업데이트

`assets/js/data.js` 의 `LECTURES` 배열 맨 위에 한 줄 추가하면 됩니다.

```js
{ d: "2026.12", t: "강의명", o: "기관명", c: ["notion", "ai"] },
```

카테고리 키: `notion` 노션 · `ai` AI · `branding` 브랜딩 · `startup` 창업 · `career` 커리어
