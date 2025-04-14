import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getUser } from "@/utils/Auth";

// Lấy danh sách chương trình tập
export async function GET(req: NextRequest) {
  const user = await getUser(req)
  try {
    const trainingPlans = await prisma.chuongtrinhtap.findMany(
      
      {
      where:{
        hocvien:{
          idUSER:user?.idUser
        }
      },
      include: { chitietmuctieu: true, },
      
    });
    return NextResponse.json(trainingPlans, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chương trình tập:", error);
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu" }, { status: 500 });
  }
}
// Tạo chương trình tập mới
export async function POST(req: NextRequest) {
  try {
    const { TenCTT, MucTieu, ThoiGian, MaHV, chiTietMucTieu } = await req.json();

    if (!TenCTT || !MaHV) {
      return NextResponse.json(
        { error: "Tên chương trình và mã học viên là bắt buộc" },
        { status: 400 }
      );
    }

    const chuongTrinhTap = await prisma.chuongtrinhtap.create({
      data: {
        TenCTT,
        MucTieu,
        ThoiGian,
        MaHV,
        
        chitietmuctieu: {
          create: chiTietMucTieu.map((item: any) => ({
            ThoiGian: item.ThoiGian,
            MoTa: item.MoTa
            
          }))|| [],
          
        }
      },
      include: { chitietmuctieu: true }
    });

    return NextResponse.json(chuongTrinhTap, { status: 201 });
  } catch (error) {
    console.error("Error creating chuongtrinhtap:", error);
    return NextResponse.json({ error: "Lỗi khi tạo dữ liệu" }, { status: 500 });
  }
}
