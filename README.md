# SHADOW ARENA: 전자상거래 홈페이지 2차 (실사풍 광고 이미지 반영)

## 실행
1. ZIP 파일을 압축 해제합니다.
2. `index.html`을 열면 홈페이지/상품 상세/데모 주문 기능을 볼 수 있습니다.
3. 웹캠은 보안 정책상 `http://localhost`나 HTTPS에서 실행하세요. Python이 설치되어 있다면 폴더 안에서 `python -m http.server 8000`을 실행한 후 브라우저에서 `http://localhost:8000`에 접속합니다.
4. 관절 추적은 실행 중 MediaPipe Pose를 CDN에서 로드하므로 인터넷이 필요합니다.

## 현재 포함
- 반응형 홈페이지, AI 생성 광고 A/B 이미지, 기능 설명 및 상세페이지
- FREE/BASIC/PLUS 요금제 — 가격은 사업계획 **예시**이며 실제 상품 판매 아님
- 결제창: 계좌이체(무통장 입금) 안내 — 계좌 정보는 `app.js` 상단 `BANK`에서 수정. 카드/PG 연동 아님
- 브라우저 웹캠 화면과 MediaPipe 관절 위치 추적 (CDN 로드 성공 시)
- 수동 점수 기능이 있는 FIGHT IQ 미션 데모 (AI 채점 아님)

## 다음 개발 단계
- 토스페이먼츠 **테스트 결제** 연동: 서버, 결제 승인 확인, 주문 DB 구축
- 로그인·구독 기능 잠금 및 결제 검증 후 활성화
- 자세 인식 정확도 테스트, 실제 AI 채점·실시간 PvP
- 실제 서비스 출시 시 필요한 사업자/PG 심사·개인정보 정책/약관

## 사용 이미지 (모두 AI 생성)
- `assets/coach-dagestan.webp` — 메인 비주얼 / 광고 A안 (AI 개인 코칭)
- `assets/pvp-dagestan.webp` — 원격 대결 배너 / 광고 B안 (PvP + FIGHT IQ)
