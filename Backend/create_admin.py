from getpass import getpass

from database import SessionLocal

import models

from auth import hash_password


def create_admin():

    db = SessionLocal()


    try:

        print(
            "\nCreate E-commerce Admin\n"
        )


        name = input(
            "Admin name: "
        ).strip()


        email = input(
            "Admin email: "
        ).strip().lower()


        password = getpass(
            "Admin password: "
        )


        confirm_password = getpass(
            "Confirm password: "
        )


        if password != confirm_password:

            print(
                "Passwords do not match"
            )

            return


        if len(password) < 8:

            print(
                "Password must contain at least 8 characters"
            )

            return


        existing_user = (

            db.query(models.User)

            .filter(
                models.User.email == email
            )

            .first()

        )


        if existing_user:

            print(
                "Email already exists"
            )

            return


        admin = models.User(

            name=name,

            email=email,

            hashed_password=hash_password(
                password
            ),

            role="admin"

        )


        db.add(admin)

        db.commit()


        print(
            "\nAdmin created successfully"
        )


    finally:

        db.close()


if __name__ == "__main__":

    create_admin()