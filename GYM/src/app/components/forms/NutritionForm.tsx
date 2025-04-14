"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const nutritionSchema = z.object({
  TenThucDon: z.string().min(1, "Tên thực đơn không được để trống"),
  SoCalo: z.coerce.number().min(0, "Số calo phải là số không âm"),
  NgayBatDau: z.string().min(1, "Ngày bắt đầu không được để trống"),
  MaHV: z.coerce.number().min(1, "Mã học viên không hợp lệ"),
  chiTietThucDon: z
    .array(
      z.object({
        idchitietthucdon: z.number().optional(),
        buaAn: z
          .array(
            z.object({
              idBuaAn: z.number().optional(),
              TenBua: z.string().min(1, "Tên bữa ăn không được để trống"),
              MoTa: z.string().min(1, "Mô tả không được để trống"),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

type NutritionFormInput = z.infer<typeof nutritionSchema>;

export default function NutritionForm({
  type = "create",
  data,
}: {
  type?: "create" | "update";
  data?: NutritionFormInput & { idThucDon?: number };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<NutritionFormInput>({
    resolver: zodResolver(nutritionSchema),
    defaultValues: {

      TenThucDon: data?.TenThucDon || "",

      SoCalo: data?.SoCalo || 0,

      NgayBatDau: data?.NgayBatDau || new Date().toISOString().split("T")[0],

      MaHV: data?.MaHV || 1,

      chiTietThucDon: data?.chiTietThucDon || [],
    },
  });

  const [newDay, setNewDay] = useState({ buaAn: [{ TenBua: "", MoTa: "" }] });
  const [newMeal, setNewMeal] = useState({ TenBua: "", MoTa: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data) {    
      reset({
        TenThucDon: data.TenThucDon || "",
        SoCalo: data.SoCalo || 0,
        NgayBatDau: data.NgayBatDau ? new Date(data.NgayBatDau).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        MaHV: data.MaHV || 1,
        chiTietThucDon: data.chiTietThucDon?.map((day) => ({
          idchitietthucdon: day.idchitietthucdon,
          buaAn: day.buaAn || [],
        }))||[],
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: NutritionFormInput) => {
    setIsSubmitting(true);
    try {
      // Kiểm tra dữ liệu trước khi gửi

      if (!formData.TenThucDon || !formData.MaHV || !formData.NgayBatDau) {

        throw new Error("Vui lòng điền đầy đủ tên thực đơn, mã học viên và ngày bắt đầu");

      }



      console.log("Submitting data:", formData); // Debug dữ liệu gửi đi
      const response = await fetch(
        type === "create" ? "/api/healthconsultation" : `/api/healthconsultation/${data?.idThucDon}`,
        {
          method: type === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {

        const errorData = await response.json();

        throw new Error(errorData.error || "Lỗi khi gửi dữ liệu");

      }

      alert(`${type === "create" ? "Create" : "Update"} thành công!`);
      if (typeof window !== "undefined") {
        const event = new CustomEvent("formSuccess");
        window.dispatchEvent(event);
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      alert(`Lỗi:${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addDay = () => {
    if (!newDay.buaAn.some((meal) => meal.TenBua && meal.MoTa)) return;

    const currentDays = watch("chiTietThucDon") || [];
    setValue("chiTietThucDon", [...currentDays, { buaAn: newDay.buaAn }]);
    setNewDay({ buaAn: [{ TenBua: "", MoTa: "" }] });
  };

  const removeDay = (index: number) => {
    const currentDays = watch("chiTietThucDon") || [];
    setValue(
      "chiTietThucDon",
      currentDays.filter((_, i) => i !== index)
    );
  };

  const addMeal = () => {
    if (!newMeal.TenBua || !newMeal.MoTa) return;

    setNewDay({
      buaAn: [...newDay.buaAn, { TenBua: newMeal.TenBua, MoTa: newMeal.MoTa }],
    });
    setNewMeal({ TenBua: "", MoTa: "" });
  };

  const removeMeal = (index: number) => {
    setNewDay({
      buaAn: newDay.buaAn.filter((_, i) => i !== index),
    });
  };

  const chiTietThucDon = watch("chiTietThucDon") || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg max-w-xl mx-auto">
      <div>
        <label className="block mb-1 font-medium">Tên thực đơn</label>
        <input {...register("TenThucDon")} className="w-full border rounded p-2" />
        {errors.TenThucDon && <p className="text-red-500 text-sm">{errors.TenThucDon.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Số calo</label>
        <input type="number" {...register("SoCalo")} className="w-full border rounded p-2" />
        {errors.SoCalo && <p className="text-red-500 text-sm">{errors.SoCalo.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Ngày bắt đầu</label>
        <input type="date" {...register("NgayBatDau")} className="w-full border rounded p-2" />
        {errors.NgayBatDau && <p className="text-red-500 text-sm">{errors.NgayBatDau.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Mã học viên</label>
        <input type="number" {...register("MaHV")} className="w-full border rounded p-2" />
        {errors.MaHV && <p className="text-red-500 text-sm">{errors.MaHV.message}</p>}
      </div>

      {/* Chi tiết thực đơn (ngày và bữa ăn) */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Chi tiết thực đơn</h3>

        {/* Nhập bữa ăn cho ngày mới */}
        <div className="mb-4">
          <h4 className="font-medium mb-1">Thêm bữa ăn cho ngày mới</h4>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Tên bữa ăn"
              value={newMeal.TenBua}
              onChange={(e) => setNewMeal({ ...newMeal, TenBua: e.target.value })}
              className="border rounded p-2 w-1/3"
            />
            <input
              type="text"
              placeholder="Mô tả"
              value={newMeal.MoTa}
              onChange={(e) => setNewMeal({ ...newMeal, MoTa: e.target.value })}
              className="border rounded p-2 w-1/3"
            />
            <button type="button" onClick={addMeal} className="bg-blue-500 text-white px-3 rounded">
              +
            </button>
          </div>
          <ul className="list-disc pl-5 text-sm text-gray-700 mb-2">
            {newDay.buaAn.length > 0 ? (
              newDay.buaAn.map((meal, idx) => (
                <li key={idx} className="flex justify-between items-center mb-1">
                  <span>
                    {meal.TenBua}: {meal.MoTa}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMeal(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Xóa
                  </button>
                </li>
              ))
            ) : (
              <li>Chưa có bữa ăn</li>
            )}
          </ul>
          <button
            type="button"
            onClick={addDay}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Thêm ngày
          </button>
        </div>

        {/* Danh sách các ngày đã thêm */}
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {chiTietThucDon.length > 0 ? (
            chiTietThucDon.map((day, dayIdx) => (
              <li key={dayIdx} className="mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    Ngày {dayIdx + 1} ({new Date(
                      new Date(watch("NgayBatDau")).getTime() + dayIdx * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()})
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDay(dayIdx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Xóa ngày
                  </button>
                </div>
                <ul className="list-circle pl-5">
                  {day.buaAn?.map((meal, mealIdx) => (
                    <li key={mealIdx} className="flex justify-between items-center">
                      <span>
                        {meal.TenBua}: {meal.MoTa}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))
          ) : (
            <li>Chưa có ngày nào</li>
          )}
        </ul>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
}
