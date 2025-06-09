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
            image_url="https://kirtisales.in/wp-content/uploads/2022/09/SAMSUNG-M326BI-M32-5G-6-128-75.jpg"
        ),
        Product(
            name="HP Pavilion Laptop",
            category="laptop",
            brand="HP",
            price=55999,
            description="Great for work and gaming.",
            image_url="https://via.placeholder.com/150"
        ),
        Product(
            name="Sony Headphones WH-CH510",
            category="accessory",
            brand="Sony",
            price=2999,
            description="Wireless Bluetooth Headphones",
            image_url="https://via.placeholder.com/150"
        ),
        # Add more as needed...
    ]

    db.session.bulk_save_objects(products)
    db.session.commit()

    print("Sample data inserted.")
