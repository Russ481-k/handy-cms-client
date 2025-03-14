import { NextResponse } from "next/server";

// 임시 메뉴 데이터 (실제 구현에서는 데이터베이스에서 가져옵니다)
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
  },
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  // 실제 구현에서는 데이터베이스에서 해당 ID의 메뉴를 조회합니다.
  const menu = menus.find((menu) => menu.id === id);

  if (!menu) {
    return NextResponse.json(
      { error: "메뉴를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json(menu);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();

    // 실제 구현에서는 데이터베이스에서 해당 ID의 메뉴를 업데이트합니다.
    // 여기서는 간단히 성공 응답만 반환합니다.

    return NextResponse.json({
      success: true,
      message: "메뉴가 수정되었습니다.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "메뉴 수정에 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // 실제 구현에서는 데이터베이스에서 해당 ID의 메뉴를 삭제합니다.
    // 여기서는 간단히 성공 응답만 반환합니다.

    return NextResponse.json({
      success: true,
      message: "메뉴가 삭제되었습니다.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "메뉴 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
