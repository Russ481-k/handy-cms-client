"use client";

import { useState } from "react";
import { Company } from "@/types/api/company";
import { useCreateCompany, useUpdateCompany } from "@/lib/hooks/useCompany";
import { X } from "lucide-react";

interface CompanyFormProps {
  company?: Company | null;
  onClose: () => void;
}

export const CompanyForm = ({ company, onClose }: CompanyFormProps) => {
  const [formData, setFormData] = useState<Company>({
    companyName: company?.companyName || "",
    tagline: company?.tagline || "",
    residentYear: company?.residentYear || new Date().getFullYear(),
    logoFileId: company?.logoFileId || 0,
    homepageUrl: company?.homepageUrl || "",
    summaryHtml: company?.summaryHtml || "",
    ceoName: company?.ceoName || "",
    foundedDate: company?.foundedDate || "",
    industry: company?.industry || "",
    location: company?.location || "",
    displayYn: company?.displayYn ?? true,
    sortOrder: company?.sortOrder || 0,
    extra: company?.extra || {},
  });

  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (company?.companyId) {
        await updateMutation.mutateAsync({
          id: company.companyId,
          company: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving company:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {company ? "기업 정보 수정" : "새 기업 등록"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  기업명 *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  태그라인
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  입주연도 *
                </label>
                <input
                  type="number"
                  name="residentYear"
                  value={formData.residentYear}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  홈페이지 URL
                </label>
                <input
                  type="url"
                  name="homepageUrl"
                  value={formData.homepageUrl}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  대표이사
                </label>
                <input
                  type="text"
                  name="ceoName"
                  value={formData.ceoName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  설립일
                </label>
                <input
                  type="date"
                  name="foundedDate"
                  value={formData.foundedDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  산업분류
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  위치
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                기업 소개
              </label>
              <textarea
                name="summaryHtml"
                value={formData.summaryHtml}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="displayYn"
                  checked={formData.displayYn}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  노출 여부
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  정렬 순서
                </label>
                <input
                  type="number"
                  name="sortOrder"
                  value={formData.sortOrder}
                  onChange={handleChange}
                  className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
