ALGO_MONTH_DAYS = {
    1: 30,
    2: 30,
    3: 30,
    4: 31,
    5: 31,
    6: 31,
    7: 30,
    8: 30,
    9: 30,
    10: 31,
    11: 29,
}


def days_in_algo_month(month: int) -> int:
    try:
        return ALGO_MONTH_DAYS[month]
    except KeyError:
        raise ValueError(f"Mois {month} invalide dans le calendrier algoréen")


month = int(input())

print(days_in_algo_month(month))
