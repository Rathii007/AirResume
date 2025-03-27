import sqlite3

# Connect to the database
conn = sqlite3.connect("@/feedback.db")
cursor = conn.cursor()

# Query the feedback table
cursor.execute("SELECT * FROM feedback")
rows = cursor.fetchall()

# Print the results
for row in rows:
    print(row)

# Close the connection
conn.close()