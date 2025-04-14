import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getUser } from "@/utils/Auth";

// Lấy danh sách thực đơn
export async function GET(req: NextRequest) {
  const user = await getUser(req);
  try {
    const mealPlans = await prisma.thucdon.findMany({
      where: {
        hocvien: {
          idUSER: user?.idUser,
        },
      },
      include: {
        chitietthucdon: {
          include: {
            buaan: true,
          },
        },
      },
    });
    return NextResponse.json(mealPlans, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thực đơn:", error);
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu" }, { status: 500 });
  }
}

// Tạo thực đơn mới
export async function POST(req: NextRequest) {
  try {
    const { TenThucDon, SoCalo, NgayBatDau, idMaHV, chiTietThucDon } = await req.json();

    if (!TenThucDon || !idMaHV || !NgayBatDau) {
      return NextResponse.json(
        { error: "Tên thực đơn, mã học viên và ngày bắt đầu là bắt buộc" },
        { status: 400 }
      );
    }

    const mealPlan = await prisma.thucdon.create({
      data: {
        TenThucDon,
        SoCalo,
        NgayBatDau: new Date(NgayBatDau),
        idMaHV,
        chitietthucdon: {
          create: chiTietThucDon?.map((item: any, index: number) => ({
            Ngay: new Date(new Date(NgayBatDau).getTime() + index * 24 * 60 * 60 * 1000),
            buaan: {
              create: item.buaAn?.map((meal: any) => ({
                TenBua: meal.TenBua,
                MoTa: meal.MoTa,
              })) || [],
            },
          })) || [],
        },
      },
      include: {
        chitietthucdon: {
          include: {
            buaan: true,
          },
        },
      },
    });

    return NextResponse.json(mealPlan, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo thực đơn:", error);
    return NextResponse.json({ error: "Lỗi khi tạo dữ liệu" }, { status: 500 });
  }
}