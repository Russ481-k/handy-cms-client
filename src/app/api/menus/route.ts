import { NextResponse } from "next/server";

// 임시 메뉴 데이터
const menus = [
  {
    id: 1,
    name: "홈",
    type: "LINK",
    url: "/",
    displayPosition: "HEADER",
    visible: true,
    sortOrder: 1,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "소개",
    type: "FOLDER",
    displayPosition: "HEADER",
    visible: true,
    sortOrder: 2,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    children: [
      {
        id: 3,
        name: "회사 소개",
        type: "CONTENT",
        targetId: 1,
        displayPosition: "HEADER",
        visible: true,
        sortOrder: 1,
        parentId: 2,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      },
      {
        id: 4,
        name: "연혁",
        type: "CONTENT",
        targetId: 2,
        displayPosition: "HEADER",
        visible: true,
        sortOrder: 2,
        parentId: 2,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      },
    ],
  },
  {
    id: 5,
    name: "게시판",
    type: "FOLDER",
    displayPosition: "HEADER",
    visible: true,
    sortOrder: 3,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    children: [
      {
        id: 6,
        name: "공지사항",
        type: "BOARD",
        targetId: 1,
        displayPosition: "HEADER",
        visible: true,
        sortOrder: 1,
        parentId: 5,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      },
      {
        id: 7,
        name: "자유게시판",
        type: "BOARD",
        targetId: 2,
        displayPosition: "HEADER",
        visible: true,
        sortOrder: 2,
        parentId: 5,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      },
    ],
  },
  {
    id: 8,
    name: "문의하기",
    type: "LINK",
    url: "/contact",
    displayPosition: "HEADER",
    visible: true,
    sortOrder: 4,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
];

export async function GET() {
  // 실제 구현에서는 데이터베이스에서 메뉴 데이터를 가져옵니다.
  return NextResponse.json(menus);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 실제 구현에서는 데이터베이스에 메뉴를 저장합니다.
    // 여기서는 간단히 성공 응답만 반환합니다.

    return NextResponse.json(
      { success: true, message: "메뉴가 생성되었습니다." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "메뉴 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
