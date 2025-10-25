import React, { useEffect, useState } from "react";
import { getReviewComments, addReviewComment } from "../../services/api";
import "./ReviewComments.css";

export default function ReviewComments({ productId, reviewId, canComment = false }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const data = await getReviewComments(productId, reviewId);
      setComments(Array.isArray(data) ? data : []);
      setError("");
    } catch (e) {
      console.error("Error cargando comentarios:", e);
      setError("No se pudieron cargar los comentarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId && reviewId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, reviewId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      setPosting(true);
      await addReviewComment(productId, reviewId, { texto: trimmed });
      setText("");
      await load();
    } catch (e) {
      console.error("Error agregando comentario:", e);
      const status = e?.response?.status;
      const detail = e?.response?.data?.detail || e?.message || "";

      if (status === 401 || detail.includes("Authentication credentials")) {
        setError("Inicia sesión para comentar.");
      } else {
        setError("No se pudo publicar el comentario.");
      }
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="review-comments">
      {loading ? (
        <p className="rc-hint">Cargando comentarios…</p>
      ) : comments.length === 0 ? (
        <p className="rc-hint">Sin comentarios.</p>
      ) : (
        <ul className="rc-list">
          {comments.map((c) => (
            <li key={c.id} className="rc-item">
              <div className="rc-head">
                <strong className="rc-user">
                  {c.usuario_nombre || `Usuario #${c.usuario}`}
                </strong>
                <span className="rc-date">
                  {new Date(c.creado_en).toLocaleString()}
                </span>
              </div>
              <p className="rc-text">{c.texto}</p>
            </li>
          ))}
        </ul>
      )}

      {error && <div className="rc-error">{error}</div>}

      {canComment && (
        <form onSubmit={onSubmit} className="rc-form">
          <textarea
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe un comentario…"
            className="rc-textarea"
          />
          <div className="rc-actions">
            <button type="submit" disabled={posting || !text.trim()} className="rc-btn">
              {posting ? "Publicando…" : "Comentar"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
