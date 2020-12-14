# Instructions
First, run `npm install` to install all dependencies specified in `package.json`. This will install the neo4j driver required to connect to the database.

Before running the application, you should spin up a local instance of the database. We've provided a convinience shell script for you that does this.
The script creates a directory called neodata in the current directory tree and binds that directory to a docker volume. This way, you won't lose any data even in the case of a system crash. 
