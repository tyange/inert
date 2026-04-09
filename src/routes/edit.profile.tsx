import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "#/lib/api";

export const Route = createFileRoute("/edit/profile")({ component: EditProfilePage });

function EditProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: me, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => api.auth.me(),
  });

  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (body: { username?: string }) => api.auth.updateMe(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      navigate({ to: "/edit" });
    },
    onError: (e) => {
      setError(e instanceof Error ? e.message : "변경에 실패했어요.");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-(--line) border-t-(--sea-ink) rounded-full animate-spin" />
      </div>
    );
  }

  if (!me) return null;

  const currentUsername = username ?? me.username;

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = currentUsername.trim();
    if (!trimmed) {
      setError("사용자명을 입력해주세요.");
      return;
    }
    if (trimmed.length > 30) {
      setError("사용자명은 30자 이내여야 합니다.");
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      setError("영문, 숫자, _, - 만 사용할 수 있습니다.");
      return;
    }

    if (trimmed === me?.username) {
      navigate({ to: "/edit" });
      return;
    }

    mutation.mutate({ username: trimmed });
  }

  return (
    <div className="max-w-[600px] mx-auto px-4 py-8">
      <h2 className="text-lg font-medium mb-6">프로필 수정</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-(--sea-ink-soft)">사용자명</label>
          <input
            type="text"
            value={currentUsername}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={30}
            className="bg-(--surface) border border-(--line) text-(--sea-ink) px-4 py-3 text-sm focus:outline-none focus:border-(--sea-ink-soft)"
          />
          <p className="text-xs text-(--sea-ink-soft)">
            영문, 숫자, _, - 사용 가능 · 공개 프로필 URL에 표시됩니다
          </p>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/edit" })}
            disabled={mutation.isPending}
            className="flex-1 py-3 border border-(--line) text-sm text-(--sea-ink) hover:border-(--sea-ink-soft) transition-colors disabled:opacity-50 cursor-pointer bg-transparent"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 py-3 bg-(--sea-ink) text-(--bg-base) text-sm font-medium hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
          >
            {mutation.isPending ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
