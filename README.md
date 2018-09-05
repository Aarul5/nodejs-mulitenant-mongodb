Dynamic database connection to mongoose from nodejs

This example describes a multi-tenant structure with each user having its own database. There might be a better way of doing this, but this was my solution.

There will be a user creation when the user creation is done "AuthDB", then i create the New DataBase under UserName.
There will be school model (schema), If user wish to create or update.
I Will get the UserName from the header and find the database.
I also check that if the user info is already stored in global, there is no need to query the database again. 
