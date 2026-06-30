import { useState, useEffect } from "react";
import axios from "axios";

import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Eye, Trash2, CloudUpload } from "lucide-react";

const UploadPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<any[]>([]);

  // 🔥 STATES
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔥 MODAL STATE
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // =========================
  // 📂 FETCH FILES
  // =========================
  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/files", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFiles(res.data);
    } catch (err: any) {
      console.error("FETCH ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // =========================
  // 👁 VIEW FILE
  // =========================
  const handleView = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/files/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const blob = await res.blob();

      const fileURL = URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );

      window.open(fileURL);
    } catch (err: any) {
      console.error("VIEW ERROR:", err);
    }
  };

  // =========================
  // 🗑 DELETE FILE (MODAL)
  // =========================
  const confirmDelete = (id: string) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/files/${selectedId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchFiles();
      setShowModal(false);
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  // =========================
  // 📤 UPLOAD FILE
  // =========================
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setErrorMsg("");
      setUploading(true);
      setProcessing(false);
      setUploadProgress(0);

      await axios.post(
        "http://localhost:5000/api/files/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );

            setUploadProgress(percent);

            if (percent === 100) {
              setUploading(false);
              setProcessing(true);
            }
          },
        }
      );

      setProcessing(false);
      fetchFiles();
    } catch (err: any) {
      setUploading(false);
      setProcessing(false);

      const msg =
        err.response?.data?.error ||
        err.response?.data?.msg ||
        "Upload failed";

      setErrorMsg(msg);
      console.error("UPLOAD ERROR:", msg);
    }
  };

  return (
    <DashboardLayout
      title="Upload Lecture"
      subtitle="Upload your lecture PDFs"
    >
      <div className="w-full space-y-6">

        {/* DROP ZONE */}
        <Card
          className={`border-2 border-dashed p-12 text-center ${
            dragActive ? "border-primary bg-primary/5" : "border-border"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);

            if (e.dataTransfer.files?.[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
        >
          <div className="flex flex-col items-center">
            <CloudUpload className="h-10 w-10 mb-3 text-primary" />

            <h3 className="font-semibold">Drop your PDF here</h3>
            <p className="text-sm text-muted-foreground mb-4">
              or click to upload
            </p>

            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              id="fileUpload"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            <label htmlFor="fileUpload">
              <Button asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </span>
              </Button>
            </label>

            {uploading && (
              <p className="mt-3 text-sm">
                Uploading... {uploadProgress}%
              </p>
            )}

            {processing && (
              <p className="mt-3 text-sm text-primary animate-pulse">
                Processing PDF...
              </p>
            )}

            {errorMsg && (
              <p className="mt-3 text-sm text-red-500">
                {errorMsg}
              </p>
            )}
          </div>
        </Card>

        {/* FILE LIST */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Uploaded Files</h3>

          <div className="space-y-3">
            {files.map((f) => (
              <div
                key={f._id}
                className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{f.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(f.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(f._id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => confirmDelete(f._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 🔥 MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[300px] text-center">
              <h3 className="font-bold mb-2">Delete File?</h3>
              <p className="text-sm mb-4">
                This action cannot be undone.
              </p>

              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>

                <Button
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default UploadPage;