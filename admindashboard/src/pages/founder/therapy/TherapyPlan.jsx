import React, { useState, useRef } from "react";
import { ChevronUp, Upload, Plus, Check, Trash2 } from "lucide-react";
import { InputGroup } from "./InputGroup";
import { uploadPlanMedia } from "@/redux/features/therapy/therapy.thunk";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function TherapyPlan({
  title,
  therapies = [],
  onAddTherapy,
  onUpdateTherapy,
  onRemoveTherapy,
  readOnly = false,
}) {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formState, setFormState] = useState({
    type: "",
    notes: "",
    url: "",
    mediaName: "",
  });

  const fileInputRef = useRef(null);

  /* ================= FILE UPLOAD ================= */

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setUploadProgress(0);

      const resultAction = await dispatch(
        uploadPlanMedia({
          formData,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total <= 0) return;
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        })
      );

      if (uploadPlanMedia.fulfilled.match(resultAction)) {
        const response = resultAction.payload;

        if (response?.url) {
          setFormState((prev) => ({
            ...prev,
            url: response.url,
            mediaName: response.name || file.name,
          }));
          toast.success("File uploaded successfully");
        } else {
          toast.error("Invalid upload response");
        }
      } else {
        toast.error(resultAction.payload || "File upload failed");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("File upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    if (!formState.type.trim()) {
      toast.error("Therapy type is required");
      return;
    }

    if (uploading) {
      toast.warning("Please wait until upload finishes");
      return;
    }

    const payload = {
      id: editingId || Date.now(),
      type: formState.type,
      notes: formState.notes,
      url: formState.url,
      mediaName: formState.mediaName,
    };

    editingId ? onUpdateTherapy(payload) : onAddTherapy(payload);
    resetForm();
  };

  /* ================= EDIT ================= */

  const handleEdit = (therapy) => {
    setEditingId(therapy.id);
    setFormState({
      type: therapy.type,
      notes: therapy.notes || "",
      url: therapy.url || "",
      mediaName: therapy.mediaName || "",
    });
    setIsOpen(true);
  };

  /* ================= RESET ================= */

  const resetForm = () => {
    setEditingId(null);
    setFormState({
      type: "",
      notes: "",
      url: "",
      mediaName: "",
    });
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ================= UI ================= */

  return (
    <div className="flex flex-col gap-3 " >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-sm font-bold text-[#011412]">{title}</h4>
        <ChevronUp
          size={16}
          className={`transition-transform ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        />
      </div>

      {isOpen && (
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-gray-50 rounded-xl  border border-gray-100 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2">
              <InputGroup
                label="Therapy Type"
                placeholder="Enter therapy type"
                value={formState.type}
                onChange={(e) =>
                  setFormState({ ...formState, type: e.target.value })
                }
              />
              <InputGroup
                label="Notes"
                placeholder="Add notes"
                value={formState.notes}
                onChange={(e) =>
                  setFormState({ ...formState, notes: e.target.value })
                }
              />
            </div>

            <InputGroup
              label="Attach URL"
              placeholder="Paste link here"
              value={formState.url}
              onChange={(e) =>
                setFormState({ ...formState, url: e.target.value })
              }
            />

            {/* ========== UPLOAD ========== */}
            <div className="">
              <label className="text-xs font-bold text-[#011412]  ">
                Media Attachment
              </label>
              <div className="flex border rounded-xl overflow-hidden bg-white mt-2">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#EBF3F2] text-xs font-bold disabled:opacity-50"
                >
                  <Upload size={14} />
                  {uploading ? `${uploadProgress}%` : "Upload"}
                </button>
                <input
                  type="text"
                  readOnly
                  value={formState.mediaName}
                  className="flex-1 px-3 text-xs outline-none "
                  placeholder="No file selected"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#9e5608] text-white text-xs font-bold rounded-lg disabled:opacity-50"
            >
              {editingId ? <Check size={14} /> : <Plus size={14} />}
              {editingId ? "Update Therapy" : "Add Therapy"}
            </button>
          </div>

          {/* ========== LIST ========== */}
          {therapies.length > 0 && (
            <div className="flex flex-col gap-2">
              {therapies.map((therapy) => (
                <div
                  key={therapy.id}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg"
                >
                  <span className="text-sm font-medium">{therapy.type}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(therapy)}
                      className="text-xs text-blue-600"
                    >
                      Edit
                    </button>
                    {!readOnly && (
                      <button
                        onClick={() => onRemoveTherapy(therapy.id)}
                        className="text-xs text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
