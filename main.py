import requests
from requests.auth import HTTPDigestAuth
import re
import csv
from datetime import datetime
from collections import Counter

# ============ Настройки ============
IP = "192.168.1.92"
USER = "admin"
PASS = "admin123"  # Замените на ваш пароль

START_DATE = "2026-01-01 00:00:00"
END_DATE = "2026-04-28 23:59:59"

CSV_FILENAME = "access_logs.csv"
LIMIT = 100  # Только первые 100 записей для теста
# ===================================


def parse_records(text):
    """Парсит ответ от устройства и возвращает список записей"""
    records = {}
    pattern = re.compile(r'records\[(\d+)\]\.(\w+)=(.*)')
    
    for line in text.splitlines():
        match = pattern.match(line)
        if match:
            idx, key, value = match.groups()
            idx = int(idx)
            if idx not in records:
                records[idx] = {}
            records[idx][key] = value.strip()
    
    return [records[i] for i in sorted(records.keys())]


def get_logs(start_date, end_date, limit=100):
    """Получает логи доступа (один запрос, без пагинации)"""
    url = f"http://{IP}/cgi-bin/recordFinder.cgi"
    auth = HTTPDigestAuth(USER, PASS)
    
    params = {
        "action": "find",
        "name": "AccessControlCardRec",
        "condition.Channel": 1,
        "condition.StartTime": start_date,
        "condition.EndTime": end_date,
        "count": limit,
        "start": 0
    }
    
    try:
        print(f"Запрос {limit} записей...")
        response = requests.get(url, params=params, auth=auth, timeout=30)
        response.raise_for_status()
        text = response.text
        
        # Показываем общее количество в системе
        found_match = re.search(r'found=(\d+)', text)
        if found_match:
            print(f"Всего записей в системе: {found_match.group(1)}")
        
        records = parse_records(text)
        print(f"Загружено: {len(records)} записей\n")
        return records
    
    except requests.exceptions.RequestException as e:
        print(f"Ошибка соединения: {e}")
        return []


def print_logs(logs, limit=20):
    """Выводит логи в консоль"""
    print(f"=== Первые {min(limit, len(logs))} записей ===\n")
    
    for rec in logs[:limit]:
        ts = int(rec.get('CreateTime', 0))
        dt = datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
        name = rec.get('CardName', '') or '(неизвестный)'
        status = "✓ Разрешён" if rec.get('Status') == '1' else "✗ Запрещён"
        method = rec.get('Method', '')
        
        print(f"{dt} | {name:40s} | {status} | Method={method}")


def save_to_csv(logs, filename="access_logs.csv"):
    """Сохраняет логи в CSV-файл (открывается в Excel)"""
    with open(filename, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.writer(f, delimiter=';')
        writer.writerow([
            'Дата/Время', 'Имя', 'UserID', 'Статус', 
            'Тип', 'Код ошибки', 'FaceIndex', 'ReaderID'
        ])
        
        for rec in logs:
            ts = int(rec.get('CreateTime', 0))
            dt = datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
            name = rec.get('CardName', '') or '(неизвестный)'
            user_id = rec.get('UserID', '')
            status = "Разрешён" if rec.get('Status') == '1' else "Запрещён"
            card_type = "Лицо" if rec.get('CardType') == '0' else "Карта"
            error = rec.get('ErrorCode', '0')
            face_index = rec.get('FaceIndex', '')
            reader_id = rec.get('ReaderID', '')
            
            writer.writerow([
                dt, name, user_id, status, 
                card_type, error, face_index, reader_id
            ])
    
    print(f"\n✓ Сохранено в файл: {filename}")


def show_stats(logs):
    """Показывает статистику по логам"""
    if not logs:
        print("Нет данных для статистики")
        return
    
    total = len(logs)
    success = sum(1 for r in logs if r.get('Status') == '1')
    failed = total - success
    
    # Топ пользователей (только успешные проходы)
    names = [r.get('CardName', '') for r in logs 
             if r.get('CardName') and r.get('Status') == '1']
    top_users = Counter(names).most_common(10)
    
    # Распределение по дням
    days = Counter()
    for r in logs:
        ts = int(r.get('CreateTime', 0))
        day = datetime.fromtimestamp(ts).strftime('%Y-%m-%d')
        days[day] += 1
    
    # Распределение по типу
    by_type = Counter()
    for r in logs:
        if r.get('Status') == '1':
            t = "Лицо" if r.get('CardType') == '0' else "Карта"
            by_type[t] += 1
    
    print(f"\n{'='*50}")
    print(f"СТАТИСТИКА")
    print(f"{'='*50}")
    print(f"Всего попыток:    {total}")
    print(f"Успешных:         {success} ({success*100/total:.1f}%)")
    print(f"Неудачных:        {failed} ({failed*100/total:.1f}%)")
    
    print(f"\n--- По типу доступа (успешные) ---")
    for type_name, count in by_type.most_common():
        print(f"  {type_name:10s}: {count}")
    
    print(f"\n--- Топ-10 пользователей ---")
    for i, (name, count) in enumerate(top_users, 1):
        print(f"  {i:2d}. {count:4d} — {name}")
    
    print(f"\n--- Активность по дням ---")
    for day, count in sorted(days.items()):
        print(f"  {day}: {count} попыток")


def show_daily_attendance(logs):
    """Показывает первый/последний проход каждого пользователя по дням"""
    attendance = {}
    
    for rec in logs:
        if rec.get('Status') != '1':
            continue
        name = rec.get('CardName', '')
        if not name:
            continue
        
        ts = int(rec.get('CreateTime', 0))
        dt = datetime.fromtimestamp(ts)
        day = dt.strftime('%Y-%m-%d')
        time = dt.strftime('%H:%M:%S')
        
        key = (day, name)
        if key not in attendance:
            attendance[key] = {'first': time, 'last': time}
        else:
            if time < attendance[key]['first']:
                attendance[key]['first'] = time
            if time > attendance[key]['last']:
                attendance[key]['last'] = time
    
    print(f"\n{'='*70}")
    print(f"ТАБЕЛЬ (первый и последний проход)")
    print(f"{'='*70}")
    print(f"{'Дата':<12} {'Имя':<40} {'Приход':<10} {'Уход':<10}")
    print(f"{'-'*70}")
    
    for (day, name), times in sorted(attendance.items()):
        print(f"{day:<12} {name[:40]:<40} {times['first']:<10} {times['last']:<10}")


# ============ MAIN ============
if __name__ == "__main__":
    print(f"Подключение к {IP}...")
    print(f"Период: {START_DATE} → {END_DATE}")
    print(f"Лимит: {LIMIT} записей (тест)\n")
    
    # 1. Загружаем логи (только LIMIT штук)
    logs = get_logs(START_DATE, END_DATE, LIMIT)
    
    if not logs:
        print("Не удалось получить данные")
        exit(1)
    
    # 2. Показываем все загруженные записи
    print_logs(logs, limit=LIMIT)
    
    # 3. Статистика
    show_stats(logs)
    
    # 4. Табель посещений
    show_daily_attendance(logs)
    
    # 5. Сохраняем в CSV
    save_to_csv(logs, CSV_FILENAME)
    
    print(f"\n{'='*50}")
    print("Готово! ✓")
    print(f"{'='*50}")