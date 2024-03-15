import React from "react";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";

const styles = {
  card: {
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    transition: "0.3s",
    "&:hover": {
      boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
    },
  },
  department: {
    marginBottom: "8px",
  },
};

const contacts = [
  { department: "Sales", contact: "John Doe - 123-456-7890" },
  { department: "Support", contact: "Jane Smith - 987-654-3210" },
  { department: "HR", contact: "Alex Johnson - 555-555-5555" },
  { department: "Marketing", contact: "Emily Brown - 222-333-4444" },
  { department: "IT", contact: "Michael Lee - 111-222-3333" },
];

const ContactPage = () => {
  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom my={4}>
        Contact Us
      </Typography>
      <Grid container spacing={3}>
        {contacts.map((contact, index) => (
          <Grid item xs={12} sm={6} lg={index < 3 ? 4 : 6} key={index}>
            <Card style={styles.card} elevation={3}>
              <CardContent>
                <Typography
                  variant="h6"
                  component="h2"
                  style={styles.department}
                >
                  {contact.department}
                </Typography>
                <Typography color="textSecondary">{contact.contact}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ContactPage;
