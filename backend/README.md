# Motivation
We have chosen the Local Neo4J DB architecture, because:
* firstly, we think it is more convenient and reliable to use a self-hosted database. In this way, the system is not dependent on third-party services and sources, as it is by the Remote GraphQL API architecture.
* secondly, in the course Independent Coursework we are currently working on a project for acknowledging plagiarism in text. It will be of a great advantage for us if we have also experience in working with a graph oriented database rather than only with a documents oriented one.
# Instructions
First, run `npm install` to install all dependencies specified in `package.json`. This will install the neo4j driver required to connect to the database.

Before running the application, you should spin up a local instance of the database. We've provided a convinience shell script `run-db.sh` for you that does this.
The script creates a directory called neodata in the current directory tree and binds that directory to a docker volume. This way, you won't lose any data even in the case of a system crash. 
