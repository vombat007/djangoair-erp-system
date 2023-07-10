import random
import string


def generate_random_code():
    generated_codes = set()

    while True:
        prefix = ''.join(random.choice(string.ascii_uppercase) for _ in range(2))
        suffix = ''.join(random.choices(string.digits, k=8))
        code = f"{prefix}{suffix}"

        if code not in generated_codes:
            generated_codes.add(code)
            return code
