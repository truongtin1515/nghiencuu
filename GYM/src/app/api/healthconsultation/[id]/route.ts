import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// Lấy chi tiết một thực đơn
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  const mealPlan = await prisma.thucdon.findUnique({
    where: { idThucDon: id },
    include: {
      chitietthucdon: {
        include: {
          buaan: true,
        },
      },
    },
  });

  if (!mealPlan) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  return NextResponse.json(mealPlan);
}

// Cập nhật thực đơn
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const body = await req.json();

  const { TenThucDon, SoCalo, NgayBatDau, idMaHV, chiTietThucDon } = body;

  try {
    // Kiểm tra xem thực đơn có tồn tại không
    const existingPlan = await prisma.thucdon.findUnique({
      where: { idThucDon: id },
    });
    if (!existingPlan) {
      return NextResponse.json({ error: "Thực đơn không tồn tại" }, { status: 404 });
    }

    // Cập nhật bảng thucdon
    const updatedPlan = await prisma.thucdon.update({
      where: { idThucDon: id },
      data: {
        TenThucDon,
        SoCalo,
        NgayBatDau: NgayBatDau ? new Date(NgayBatDau) : existingPlan.NgayBatDau,
        idMaHV,
      },
      include: {
        chitietthucdon: {
          include: {
            buaan: true,
          },
        },
      },
    });

    // Xử lý chiTietThucDon
    if (chiTietThucDon && Array.isArray(chiTietThucDon)) {
      // Lấy danh sách idchitietthucdon hiện có
      const existingDetails = await prisma.chitietthucdon.findMany({
        where: { idThucDon: id },
        select: { idchitietthucdon: true },
      });
      const existingDetailIds = existingDetails.map((d:{idchitietthucdon:number}) => d.idchitietthucdon);

      // Danh sách idchitietthucdon từ client
      const clientDetailIds = chiTietThucDon
        .filter((ct: any) => ct.idchitietthucdon)
        .map((ct: any) => ct.idchitietthucdon);

      // Xóa các chiTietThucDon không còn trong danh sách client
      const detailsToDelete = existingDetailIds.filter((id: number) => !clientDetailIds.includes(id));
      if (detailsToDelete.length > 0) {
        await prisma.chitietthucdon.deleteMany({
          where: {
            idchitietthucdon: { in: detailsToDelete },
          },
        });
      }

      // Cập nhật hoặc thêm mới chiTietThucDon
      for (const [index, ct] of chiTietThucDon.entries()) {
        const calculatedDate = new Date(
          new Date(NgayBatDau || existingPlan.NgayBatDau).getTime() + index * 24 * 60 * 60 * 1000
        );

        if (ct.idchitietthucdon) {
          // Cập nhật chi tiết thực đơn hiện có
          await prisma.chitietthucdon.update({
            where: { idchitietthucdon: ct.idchitietthucdon },
            data: {
              Ngay: calculatedDate,
            },
          });

          // Xử lý buaan cho chi tiết thực đơn
          const existingMeals = await prisma.buaan.findMany({
            where: { idChiTietThucDon: ct.idchitietthucdon },
            select: { idBuaAn: true },
          });
          const existingMealIds = existingMeals.map((m:{idBuaAn:number}) => m.idBuaAn);
          const clientMealIds = ct.buaAn
            ?.filter((meal: any) => meal.idBuaAn)
            .map((meal: any) => meal.idBuaAn) || [];

          // Xóa các bữa ăn không còn trong danh sách client
          const mealsToDelete = existingMealIds.filter((id: number) => !clientDetailIds.includes(id));
          if (mealsToDelete.length > 0) {
            await prisma.buaan.deleteMany({
              where: {
                idBuaAn: { in: mealsToDelete },
              },
            });
          }

          // Cập nhật hoặc thêm mới bữa ăn
          for (const meal of ct.buaAn || []) {
            if (meal.idBuaAn) {
              await prisma.buaan.update({
                where: { idBuaAn: meal.idBuaAn },
                data: {
                  TenBua: meal.TenBua,
                  MoTa: meal.MoTa,
                },
              });
            } else {
              await prisma.buaan.create({
                data: {
                  TenBua: meal.TenBua,
                  MoTa: meal.MoTa,
                  idChiTietThucDon: ct.idchitietthucdon,
                },
              });
            }
          }
        } else {
          // Thêm mới chi tiết thực đơn
          await prisma.chitietthucdon.create({
            data: {
              Ngay: calculatedDate,
              idThucDon: id,
              buaan: {
                create: ct.buaAn?.map((meal: any) => ({
                  TenBua: meal.TenBua,
                  MoTa: meal.MoTa,
                })) || [],
              },
            },
          });
        }
      }
    }

    // Lấy lại dữ liệu mới nhất để trả về
    const updatedData = await prisma.thucdon.findUnique({
      where: { idThucDon: id },
      include: {
        chitietthucdon: {
          include: {
            buaan: true,
          },
        },
      },
    });

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error("Lỗi cập nhật thực đơn:", error);
    return NextResponse.json({ error: "Lỗi cập nhật thực đơn" }, { status: 500 });
  }
}

// Xóa thực đơn
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  try {
    // Kiểm tra xem thực đơn có tồn tại không
    const existingPlan = await prisma.thucdon.findUnique({
      where: { idThucDon: id },
    });
    if (!existingPlan) {
      return NextResponse.json({ error: "Thực đơn không tồn tại" }, { status: 404 });
    }

    // Xóa thực đơn (các chi tiết thực đơn và bữa ăn sẽ tự động xóa do onDelete: Cascade)
    await prisma.thucdon.delete({ where: { idThucDon: id } });

    return NextResponse.json({ message: "Đã xóa thực đơn" });
  } catch (error) {
    console.error("Lỗi xóa thực đơn:", error);
    return NextResponse.json({ error: "Lỗi xóa thực đơn" }, { status: 500 });
  }
}