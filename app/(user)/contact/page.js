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
  {
    department: "Awas Cell",
    contact: "Police Lines, Kanpur Nagar commissionerate",
  },
  { department: "ACP Lines", contact: "Email: lineacp89@gmail.com" },
  {
    department: "DCP Headquarters",
    contact: "Email: dcphqknr@gmail.com / CUG No: 9454400579",
  },
  // { department: "CUG No", contact: "" },
  // { department: "IT", contact: "Michael Lee - 111-222-3333" },
];

const ContactPage = () => {
  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom my={4}>
        Contact Us
      </Typography>
      <Grid container spacing={3}>
        {contacts.map((contact, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            lg={index < 3 ? 4 : 6}
            key={index}
            style={{ height: "100%" }}
          >
            <Card style={styles.card} elevation={3}>
              <CardContent>
                <Typography
                  variant="h6"
                  component="h2"
                  style={styles.department}
                >
                  {contact.department}
                </Typography>
                {contact.contact.split("/").map((line, index) => (
                  <Typography key={index} color="textSecondary">
                    {line}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ContactPage;
