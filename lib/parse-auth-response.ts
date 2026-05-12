/** Auth POST хариу — HTML/502 гэх мэт тохиолдолд илүү ойлгомжтой алдаа өгнө. */
export async function parseAuthResponse(
  res: Response,
): Promise<
  | { ok: true; json: Record<string, unknown> }
  | { ok: false; displayError: string }
> {
  const ct = (res.headers.get("content-type") ?? "").toLowerCase();
  if (ct.includes("application/json")) {
    try {
      const json = (await res.json()) as Record<string, unknown>;
      return { ok: true, json };
    } catch {
      return {
        ok: false,
        displayError: `Алдаа (${res.status}) — серверээс JSON унших боломжгүй.`,
      };
    }
  }
  let snippet = "";
  try {
    snippet = (await res.text()).slice(0, 280).trim();
  } catch {
    /* ignore */
  }
  if (
    snippet.includes("Cannot GET") ||
    res.status === 404 ||
    snippet.includes("<!DOCTYPE")
  ) {
    return {
      ok: false,
      displayError:
        "API буруу хаяг эсвэл backend хуучин хувилбар (JSON хариу ирээгүй). NEXT_PUBLIC_API_URL болон deploy шалгана уу.",
    };
  }
  if (res.status >= 502 && res.status <= 504) {
    return {
      ok: false,
      displayError:
        "Шилжүүлэгч/хост түр унтарсан байна (502–504). Хэдэн минутын дараа дахин оролдоно уу.",
    };
  }
  return {
    ok: false,
    displayError:
      snippet || `Алдаа (${res.status}) — сервер JSON биш хариу буцаасан.`,
  };
}
