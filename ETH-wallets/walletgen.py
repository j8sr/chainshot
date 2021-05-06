#!/usr/bin/python3

from secrets import token_bytes
from coincurve import PublicKey
from sha3 import keccak_256


def generate_wallet():
    """
    simple function to generate a wallet address
    """
    private_key = keccak_256(token_bytes(32)).digest()
    public_key = PublicKey.from_valid_secret(private_key).format(compressed=False)[1:]
    addr = keccak_256(public_key).digest()[-20:]
    return [private_key, public_key, addr]


if __name__ == "__main__":
    keys = generate_wallet()
    print(f"private key: {keys[0].hex()}\naddress: {keys[2].hex()}")

