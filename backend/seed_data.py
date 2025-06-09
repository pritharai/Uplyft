from app import db, Product, app

with app.app_context():
    db.create_all()


    # Add sample products
    products = [
        Product(
            name="Samsung Galaxy M32",
            category="phone",
            brand="Samsung",
            price=14999,
            description="A budget phone with AMOLED display.",
            image_url="http://localhost:5000/static/images/download.jpeg"
        ),
        Product(
            name="HP Pavilion Laptop",
            category="laptop",
            brand="HP",
            price=55999,
            description="Great for work and gaming.",
            image_url="http://localhost:5000/static/images/pavillion.webp"
        ),
        Product(
            name="Sony Headphones WH-CH510",
            category="accessory",
            brand="Sony",
            price=2999,
            description="Wireless Bluetooth Headphones",
            image_url="http://localhost:5000/static/images/sony.webp"
        ),
        # Add more as needed...
    ]

    db.session.bulk_save_objects(products)
    db.session.commit()

    print("Sample data inserted.")
