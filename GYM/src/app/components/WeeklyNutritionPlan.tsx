"use client";
import { useState, useEffect } from "react";
import { role } from "../lib/data";
import FormModal from "./FormModal";
import TableSearch from "./TableSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const WeeklyNutritionPlan = () => {
  const Role = role;
  const [menuFood, setMenuFood] = useState<any[]>([]);

  // Hàm lấy danh sách thực đơn từ API
  const fetchMealPlans = async () => {
    try {
      const res = await fetch("/api/healthconsultation", {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        setMenuFood(data);
      } else {
        console.error("Lỗi khi lấy danh sách thực đơn");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchMealPlans();
  }, []);

  // Hàm xử lý khi form thành công (tạo/sửa/xóa)
  const handleFormSuccess = () => {
    fetchMealPlans(); // Tải lại danh sách thực đơn
  };

  return (
    <div className="p-6 flex flex-col justify-center items-center">
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <TableSearch />
        {Role === "admin" && (
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
            </button>
            <FormModal table="nutrition" type="create"  />
          </div>
        )}
      </div>
      {menuFood.map((plan) => (
        <div key={plan.idThucDon} className="mb-8 w-[80%] p-4">
          <div className="flex mr-4">
            <h2 className="text-xl font-bold mb-2">{plan.TenThucDon}</h2>
            <FormModal table="nutrition" type="update" data={plan}  />
            <FormModal table="nutrition" type="delete" id={plan.idThucDon} onSuccess={handleFormSuccess} />
          </div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="border border-gray-300 p-2">Ngày / Bữa</th>
                <th className="border border-gray-300 p-2">Thực đơn</th>
              </tr>
            </thead>
            <tbody>
              {plan.chitietthucdon.map((day: any) => (
                <>
                  <tr key={day.idchitietthucdon} className="bg-base-300">
                    <td className="border border-gray-300 p-2 font-semibold hover:bg-gray-400" colSpan={2}>
                      {new Date(day.Ngay).toLocaleDateString()}
                    </td>
                  </tr>
                  {day.buaan.map((meal: any) => (
                    <tr key={meal.idBuaAn} className="hover:bg-gray-400">
                      <td className="border border-gray-300 p-2">{meal.TenBua}</td>
                      <td className="border border-gray-300 p-2">{meal.MoTa}</td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default WeeklyNutritionPlan;
