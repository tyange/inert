import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { api } from "#/lib/api";

export const Route = createFileRoute("/edit/new")({ component: EditNewPage });

function EditNewPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;

    const combined = [...files, ...selected].slice(0, 10);
    setFiles(combined);
    setPreviews(combined.map((f) => URL.createObjectURL(f)));
  }

  function removeImage(index: number) {
    const nextFiles = files.filter((_, i) => i !== index);
    const nextPreviews = previews.filter((_, i) => i !== index);
    setFiles(nextFiles);
    setPreviews(nextPreviews);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) {
      setError("이미지를 한 장 이상 추가해주세요");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const imageKeys: string[] = [];
      for (const file of files) {
        const result = await api.images.upload(file);
        imageKeys.push(result.image_key);
      }

      await api.stills.create({
        caption: caption.trim() || undefined,
        image_keys: imageKeys,
      });

      navigate({ to: "/edit" });
    } catch (e) {
      console.error(e);
      setError("업로드에 실패했어요. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h2 className="text-lg font-medium mb-6">새 스틸</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* 이미지 업로드 영역 */}
        <div>
          {previews.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 mb-3">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="aspect-square relative overflow-hidden bg-(--surface) group"
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-(--surface)/60 rounded-full text-(--sea-ink) text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-(--surface-strong)"
                  >
                    ×
                  </button>
                </div>
              ))}
              {previews.length < 10 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square bg-(--surface) border border-dashed border-(--line) flex items-center justify-center text-(--sea-ink-soft) hover:border-(--sea-ink-soft) hover:text-(--sea-ink) transition-colors text-2xl cursor-pointer"
                >
                  +
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-video bg-(--surface) border border-dashed border-(--line) flex flex-col items-center justify-center gap-2 text-(--sea-ink-soft) hover:border-(--sea-ink-soft) hover:text-(--sea-ink) transition-colors cursor-pointer"
            >
              <span className="text-3xl">+</span>
              <span className="text-sm">이미지 추가 (최대 10장)</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* 캡션 */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="캡션을 입력하세요 (선택)"
          maxLength={2200}
          rows={4}
          className="bg-(--surface) border border-(--line) text-(--sea-ink) placeholder-current/40 px-4 py-3 text-sm resize-none focus:outline-none focus:border-(--sea-ink-soft)"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/edit" })}
            disabled={isSubmitting}
            className="flex-1 py-3 border border-(--line) text-sm text-(--sea-ink) hover:border-(--sea-ink-soft) transition-colors disabled:opacity-50 cursor-pointer bg-transparent"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting || files.length === 0}
            className="flex-1 py-3 bg-(--sea-ink) text-(--bg-base) text-sm font-medium hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
          >
            {isSubmitting ? "업로드 중..." : "올리기"}
          </button>
        </div>
      </form>
    </div>
  );
}
