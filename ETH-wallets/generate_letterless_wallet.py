#!/usr/bin/python3

import re

from walletgen import generate_wallet


def get_wallet():
    """
    gets wallet from the wallet generator
    """
    return generate_wallet()


def main():
    """
    start generating wallets, looking for one without any letters in it
    """
    count = 0;
    while (True):
        count += 1

        # generate wallet
        wallet = get_wallet()

        # check for no letters
        if wallet[2].hex().isnumeric():
            print(f"Found a wallet without letters after {count} tries!!!!\
                    \npriv: {wallet[0].hex()}\npub:  {wallet[1].hex()}\
                    \naddr: {wallet[2].hex()}")
            return

        # log every 1m wallets generated
        if not count % 1000000:
            print(f"generated {count} wallets so far")


if __name__ == "__main__":
    main()
