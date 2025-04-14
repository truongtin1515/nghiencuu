"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import FormModal from "./FormModal";
import TableSearch from "./TableSearch";
import { useMyContext } from "@/contexts/useContext";

interface ChiTietMucTieu {
  idChiTietMucTieu: number;
  ThoiGian: string;
  MoTa: string;
}

interface ChuongTrinhTap {
  idChuongTrinhTap: number;
  TenCTT: string;
  MucTieu: string;
  ThoiGian: string;
  MaHV: number;
  chitietmuctieu: ChiTietMucTieu[];
}



export default function TrainingPrograms() {
  const {user} = useMyContext()
  const [trainingPlans, setTrainingPlans] = useState<ChuongTrinhTap[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<ChuongTrinhTap[]>([]); // Danh sách đã lọc
  const [searchQuery, setSearchQuery] = useState<string>(""); // Từ khóa tìm kiếm
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Lấy dữ liệu từ API
  const fetchTrainingPlans = async () => {
    try {
      const response = await fetch("/api/TraniningPlans", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu chương trình tập");
      }

      const data: ChuongTrinhTap[] = await response.json();
      console.log("Fetched training plans:", data);
      setTrainingPlans(data);
      setFilteredPlans(data); // Ban đầu hiển thị toàn bộ danh sách
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    fetchTrainingPlans();
  }, []);




  // //tìm kiếm 
  // // Lọc danh sách khi searchQuery thay đổi
  // useEffect(() => {
  //   if (!searchQuery) {
  //     setFilteredPlans(trainingPlans); // Nếu không có từ khóa, hiển thị toàn bộ
  //   } else {
  //     const lowerQuery = searchQuery.toLowerCase();
  //     const filtered = trainingPlans.filter((plan) => {
  //       // Tìm kiếm trong TenCTT, MucTieu, ThoiGian
  //       const matchesPlan =
  //         plan.TenCTT.toLowerCase().includes(lowerQuery) ||
  //         plan.MucTieu.toLowerCase().includes(lowerQuery) ||
  //         plan.ThoiGian.toLowerCase().includes(lowerQuery);

  //       // Tìm kiếm trong chi tiết mục tiêu
  //       const matchesDetails = plan.chitietmuctieu.some(
  //         (detail) =>
  //           detail.ThoiGian.toLowerCase().includes(lowerQuery) ||
  //           detail.MoTa.toLowerCase().includes(lowerQuery)
  //       );

  //       return matchesPlan || matchesDetails; // Trả về true nếu khớp bất kỳ trường nào
  //     });
  //     setFilteredPlans(filtered);
  //   }
  // }, [searchQuery, trainingPlans]);

  // // Xử lý tìm kiếm
  // const handleSearch = (query: string) => {
  //   setSearchQuery(query);
  // };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold text-center mb-14">
        CHƯƠNG TRÌNH TẬP (TRAINING PLANS)
      </h1>
      <ul className="steps steps-vertical lg:steps-horizontal mb-8">
        <li className="step step-primary">Chưa Được</li>
        <li className="step step-primary">Cũng Cũng</li>
        <li className="step">Ngon</li>
        <li className="step">Xiu MLEMMLEM</li>
      </ul>
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto mb-8">
        {/* <TableSearch onSearch={handleSearch} />  */}
        <TableSearch />
        <div className="flex items-center gap-4 self-end">
          <button className="w-8 h-8 flex items-center justify-center">
            <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
          </button>
          {user.admin === "admin" && <FormModal table="training" type="create" />}
        </div>
      </div>
      {filteredPlans.length === 0 ? (
        <p className="text-center text-gray-500">Không tìm thấy chương trình tập nào.</p>
      ) : (
        filteredPlans.map((plan, index) => (
          <div key={plan.idChuongTrinhTap} className="mb-8 relative p-4 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-2">
              {index + 1}. {plan.TenCTT}
            </h2>
            <p className="mb-1">
              <strong>Mục tiêu:</strong> {plan.MucTieu || "Chưa có mục tiêu"}
            </p>
            <p className="mb-2">
              <strong>Thời gian:</strong> {plan.ThoiGian || "Chưa xác định"}
            </p>
            <ul className="list-disc pl-5">
              {plan.chitietmuctieu.length > 0 ? (
                plan.chitietmuctieu.map((detail) => (
                  <li key={detail.idChiTietMucTieu} className="mb-1">
                    <strong>{detail.ThoiGian}:</strong> {detail.MoTa}
                  </li>
                ))
              ) : (
                <li>Chưa có chi tiết mục tiêu</li>
              )}
            </ul>

            {user.admin === "admin" && (
              <div className="absolute top-2 right-2 flex gap-2">
                <FormModal
                  table="training"
                  type="update"
                  data={{
                    idChuongTrinhTap: plan.idChuongTrinhTap,
                    TenCTT: plan.TenCTT || "",
                    MucTieu: plan.MucTieu || "",
                    ThoiGian: plan.ThoiGian || "",
                    MaHV: plan.MaHV || 1,
                    chiTietMucTieu: plan.chitietmuctieu?.map((d) => ({
                      idChiTietMucTieu: d.idChiTietMucTieu,
                      ThoiGian: d.ThoiGian || "",
                      MoTa: d.MoTa || "",
                    })) || [],
                  }}
                />
                <FormModal table="training" type="delete" id={plan.idChuongTrinhTap} onSuccess={fetchTrainingPlans}/>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}