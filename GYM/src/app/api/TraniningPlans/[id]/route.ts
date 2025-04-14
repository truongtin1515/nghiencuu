import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// Lấy chi tiết 1 chương trình tập
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  const plan = await prisma.chuongtrinhtap.findUnique({
    where: { idChuongTrinhTap: id },
    include: { chitietmuctieu: true },
  });

  if (!plan) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  return NextResponse.json(plan);
}

// Cập nhật chương trình tập
export async function PUT(req: NextRequest, context: { params: { id: string }}) {
  const id = parseInt(context.params.id);
  const body = await req.json();

  const { TenCTT, MucTieu, ThoiGian, MaHV, chiTietMucTieu } = body;

  try {
    // Kiểm tra xem chương trình tập có tồn tại không
    const existingPlan = await prisma.chuongtrinhtap.findUnique({
      where: { idChuongTrinhTap: id },
    });
    if (!existingPlan) {
      return NextResponse.json({ error: "Chương trình tập không tồn tại" }, { status: 404 });
    }

    // Cập nhật bảng chuongtrinhtap
    const updatedPlan = await prisma.chuongtrinhtap.update({
      where: { idChuongTrinhTap: id },
      data: {
        TenCTT,
        MucTieu,
        ThoiGian,
        MaHV,
      },
      include: { chitietmuctieu: true }
    });

    // Xử lý chiTietMucTieu
    if (chiTietMucTieu && Array.isArray(chiTietMucTieu)) {
      // Lấy danh sách idChiTietMucTieu hiện có
      const existingDetails = await prisma.chitietmuctieu.findMany({
        where: { idChuongTrinhTap: id },
        select: { idChiTietMucTieu: true },
      });
      const existingDetailIds = existingDetails.map((d:{idChiTietMucTieu:number}) => d.idChiTietMucTieu);

      // Danh sách idChiTietMucTieu từ client
      const clientDetailIds = chiTietMucTieu
        .filter((ct: any) => ct.idChiTietMucTieu)
        .map((ct: any) => ct.idChiTietMucTieu);

      // Xóa các chiTietMucTieu không còn trong danh sách client
      const detailsToDelete = existingDetailIds.filter((id: number) => !clientDetailIds.includes(id));
      if (detailsToDelete.length > 0) {
        await prisma.chitietmuctieu.deleteMany({
          where: {
            idChiTietMucTieu: { in: detailsToDelete },
          },
        });
      }

      // Cập nhật hoặc thêm mới chiTietMucTieu
      for (const ct of chiTietMucTieu) {
        if (ct.idChiTietMucTieu) {
          // Cập nhật chi tiết mục tiêu hiện có
          await prisma.chitietmuctieu.update({
            where: { idChiTietMucTieu: ct.idChiTietMucTieu },
            data: {
              ThoiGian: ct.ThoiGian,
              MoTa: ct.MoTa,
            },
          });
        } else {
          // Thêm mới chi tiết mục tiêu
          await prisma.chitietmuctieu.create({
            data: {
              ThoiGian: ct.ThoiGian,
              MoTa: ct.MoTa,
              idChuongTrinhTap: id,
            },
          });
        }
      }
    }

    // Lấy lại dữ liệu mới nhất để trả về
    const updatedData = await prisma.chuongtrinhtap.findUnique({
      where: { idChuongTrinhTap: id },
      include: { chitietmuctieu: true },
    });

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error("Lỗi cập nhật chương trình tập:", error);
    return NextResponse.json({ error: "Lỗi cập nhật chương trình tập" }, { status: 500 });
  }
}

// Xóa chương trình tập
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  try {
    // Kiểm tra xem chương trình tập có tồn tại không
    const existingPlan = await prisma.chuongtrinhtap.findUnique({
      where: { idChuongTrinhTap: id },
    });
    if (!existingPlan) {
      return NextResponse.json({ error: "Chương trình tập không tồn tại" }, { status: 404 });
    }

    // Xóa chi tiết mục tiêu trước
    await prisma.chitietmuctieu.deleteMany({ where: { idChuongTrinhTap: id } });
    // Xóa chương trình tập
    await prisma.chuongtrinhtap.delete({ where: { idChuongTrinhTap: id } });

    return NextResponse.json({ message: "Đã xóa chương trình tập" });
  } catch (error) {
    console.error("Lỗi xóa chương trình tập:", error);
    return NextResponse.json({ error: "Lỗi xóa chương trình tập" }, { status: 500 });
  }
}
