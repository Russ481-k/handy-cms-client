import { NextResponse } from "next/server";

// 임시 컨텐츠 데이터
const contents = [
  {
    id: 1,
    name: "회사 소개",
    title: "회사 소개",
    slug: "about",
    status: "PUBLISHED",
    authorId: 1,
    publishedAt: "2023-01-01T00:00:00Z",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "연혁",
    title: "회사 연혁",
    slug: "history",
    status: "PUBLISHED",
    authorId: 1,
    publishedAt: "2023-01-01T00:00:00Z",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "서비스 소개",
    title: "서비스 소개",
    slug: "services",
    status: "PUBLISHED",
    authorId: 1,
    publishedAt: "2023-01-01T00:00:00Z",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "이용약관",
    title: "이용약관",
    slug: "terms",
    status: "PUBLISHED",
    authorId: 1,
    publishedAt: "2023-01-01T00:00:00Z",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 5,
    name: "개인정보처리방침",
    title: "개인정보처리방침",
    slug: "privacy",
    status: "PUBLISHED",
    authorId: 1,
    publishedAt: "2023-01-01T00:00:00Z",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
];

export async function GET() {
  // 실제 구현에서는 데이터베이스에서 컨텐츠 데이터를 가져옵니다.
  return NextResponse.json(contents);
}
