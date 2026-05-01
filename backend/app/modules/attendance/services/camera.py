import re

import httpx

_RECORD_RE = re.compile(r"records\[(\d+)\]\.(\w+)=(.*)")

CAMERA_CGI_PATH = "/cgi-bin/recordFinder.cgi"


class CameraService:
    @staticmethod
    def _parse_response(text: str) -> list[dict[str, str]]:
        raw: dict[int, dict[str, str]] = {}
        for line in text.splitlines():
            m = _RECORD_RE.match(line)
            if m:
                idx, key, value = m.groups()
                raw.setdefault(int(idx), {})[key] = value.strip()
        return [raw[i] for i in sorted(raw)]

    async def fetch_raw_logs(
        self,
        ip: str,
        login: str,
        password: str,
        start_time: str,
        end_time: str,
        limit: int = 1000,
    ) -> list[dict[str, str]]:
        url = f"http://{ip}{CAMERA_CGI_PATH}"
        params = {
            "action": "find",
            "name": "AccessControlCardRec",
            "condition.Channel": 1,
            "condition.StartTime": start_time,
            "condition.EndTime": end_time,
            "count": limit,
            "start": 0,
        }
        async with httpx.AsyncClient(
            auth=httpx.DigestAuth(login, password),
            timeout=30,
        ) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()

        return self._parse_response(response.text)
