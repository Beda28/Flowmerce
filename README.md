## Overview
온라인 중고 거래 플랫폼입니다.
판매자가 상품을 등록하고 구매자가 구매할 수 있습니다.
실시간 채팅, 게시판, 주문 관리 시스템을 포함한 종합 쇼핑몰입니다.
---
## Tech Stack
### Backend
* FastAPI (Python)
* SQLAlchemy (Async ORM)
* aiomysql / Redis / Motor (MongoDB)
* JWT 인증
### Frontend
* React 18 + TypeScript
* Vite
* Tailwind CSS + Shadcn UI
* Axios
### Database
* MySQL 8.0 (주 데이터)
* Redis (세션/토큰)
* MongoDB (채팅 메시지)
### Infra
* Docker / Docker Compose
* Nginx (리버스 프록시)
---
## Features
### 인증
* 회원가입 / 로그인
* JWT Access/Refresh 토큰
* 역할별 권한 (사용자/관리자)
### 상품
* 상품 목록/상세 (판매자 정보 포함)
* 상품 검색 (키워드/카테고리)
* 상품 등록/수정/삭제
* 재고 관리
### 장바구니/주문
* 장바구니 추가/수량 변경/삭제
* 주문 생성 (자동 결제)
* 주문 상태 변경 (결제완료 → 배송중 → 거래완료)
* 주문 취소
### 판매 관리
* 내 상품 목록
* 판매 주문 목록
* 주문 상태 변경 (배송중/거래완료)
### 게시판
* 게시글 CRUD
* 제목/내용 검색
* 조회수 증가 기능
### 채팅 문의
* 상품 문의 (1:1 채팅)
* WebSocket 실시간 연결
* MongoDB 메시지 저장
* 상담 종료 기능
### 관리자
* 사용자 관리 (잔고 수정/삭제)
* 전체 거래 관리 (상태 변경)
* 전체 상품 관리
* 전체 게시판 관리
---
## Project Structure
flowback/
  ┣ app.py              # 메인 앱
  ┣ routes/             # API 엔드포인트
  ┃  ┣ auth.py          # 인증 (로그인/회원가입/잔고)
  ┃  ┣ product.py       # 상품 (CRUD/검색)
  ┃  ┣ cart.py          # 장바구니/주문
  ┃  ┣ board.py         # 게시판
  ┃  ┣ chat.py          # WebSocket 채팅
  ┃  ┣ admin_product.py # 관리자 상품
  ┃  ┣ admin_order.py   # 관리자 거래
  ┃  ┣ admin_board.py   # 관리자 게시판
  ┃  ┗ admin_user.py    # 관리자 유저
  ┣ repository/         # 데이터 액세스
  ┣ db/                 # 모델, 엔진
  ┣ dto/                # 데이터 전송 객체
  ┗ utils/              # 유틸리티
flowfront/
  ┣ src/
  ┃  ┣ api/             # API 클라이언트
  ┃  ┣ components/      # 공통 컴포넌트
  ┃  ┣ pages/           # 페이지
  ┃  ┃  ┣ auth/         # 로그인/회원가입
  ┃  ┃  ┣ Product/      # 상품 (목록/상세/등록)
  ┃  ┃  ┣ Cart/         # 장바구니
  ┃  ┃  ┣ Board/        # 게시판
  ┃  ┃  ┣ Chat/         # 채팅
  ┃  ┃  ┣ MyPage/       # 마이페이지
  ┃  ┃  ┗ admin/        # 관리자
  ┃  ┣ types/           # 타입 정의
  ┃  ┗ utils/           # 유틸리티
  ┗ main.tsx            # 진입점
flow-sql/               # MySQL 초기화 스크립트
nginx/                  # Nginx 설정
---
## Architecture
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Auth    │  │  Pages   │  │Components│  │  API   │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (Axios)
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  Nginx (Port 80/8080)                   │
│            Static Files / Reverse Proxy                 │
└────────────────────────┬────────────────────────────────┘
                         │ /api/*
                         ▼
┌─────────────────────────────────────────────────────────┐
│               Backend (FastAPI - Port 8000)             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Routes  │  │Repository│  │   DTO    │  │ Utils  │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
└──────┬──────────────┬──────────────┬────────────────────┘
       │              │              │
       ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│  MySQL   │   │  Redis   │   │ MongoDB  │
│ (Primary)│   │ (Session)│   │  (Chat)  │
└──────────┘   └──────────┘   └──────────┘
---
## Database Schema
| 테이블 | 설명 |
|--------|------|
| users | 사용자 정보, 잔액, 역할 |
| product | 상품 정보 (카테고리 JSON) |
| cart | 장바구니 |
| orders | 주문 (상태: paid/shipping/completed/cancelled) |
| board | 게시글 (조회수) |
| chat_rooms | 채팅방 (MongoDB: 메시지) |
---
## API Endpoints
| Method | Path | 설명 |
|--------|------|------|
| POST | /auth/login | 로그인 |
| POST | /auth/register | 회원가입 |
| POST | /auth/balance | 잔고 충전 |
| GET | /product/list/{page} | 상품 목록 |
| GET | /product/info/{pid} | 상품 상세 |
| POST | /product/write | 상품 등록 |
| POST | /product/search | 상품 검색 |
| POST | /cart/add | 장바구니 추가 |
| POST | /cart/order | 주문 생성 |
| PATCH | /cart/order/{id}/status | 주문 상태 변경 |
| GET | /board/list/{page} | 게시판 목록 |
| POST | /chat/room | 채팅방 생성 |
| GET | /chat/rooms | 채팅방 목록 |
| GET | /admin/order/list | 관리자 거래 목록 |
---
## Getting Started
```bash
# 실행
docker compose up -d
# 빌드
docker compose build
# 로그 확인
docker compose logs -f flowback