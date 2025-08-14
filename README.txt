Live GPS Overlay (Mapbox + Firebase + Distance + Weather + Clock)

파일 구성
- index.html  : 오버레이 메인
- style.css   : 스타일
- firebase.js : Firebase 설정(필수로 수정)
- script.js   : 거리/속도 계산, 경로 라인, 날씨, 시계
-------------------------------------------------------------

1) Firebase 설정
- firebase.js 의 FIREBASE_CONFIG를 본인 프로젝트 값으로 교체
- 위치 데이터는 기본 경로 /drivers/{driverId}/location 에서 구독
- URL에서 driverId를 지정: index.html?driverId=driver-1

데이터 예시
{
  "lat": 37.5665,
  "lon": 126.9780,
  "accuracy": 5,
  "ts": 1734200000000
}

2) Mapbox
- 사용자 토큰이 index.html에 미리 삽입되어 있습니다.

3) 날씨 (선택)
- OpenWeather API Key를 URL로 전달: &owmKey=YOUR_KEY
- 언어: &lang=ko  (기본 ko)
- 예: index.html?driverId=driver-1&owmKey=YOUR_KEY&zoom=15&style=mapbox/streets-v11&lang=ko

4) 지도 옵션
- zoom=숫자
- style=mapbox/streets-v11 (또는 사용자 스타일 ID)
- follow=0  (지도 중심 따라가기 끄기)
- path=0    (경로 라인 숨기기)

5) OBS 사용
- 로컬 파일로 index.html을 직접 추가하거나, 간이 웹서버로 호스팅 후 URL로 연결
- 배경은 투명

6) 거리 누적/리셋
- 날짜/driverId 기준 localStorage에 자동 저장
- 리셋: 개발자콘솔에서 localStorage.removeItem('dist:driver-1:YYYY-MM-DD')

7) 드리프트/오차 필터
- 3m 미만 이동 무시, 200km/h 초과 속도는 오차로 간주
