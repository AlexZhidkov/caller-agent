import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function InfoPage() {
  return (
    <Box sx={{ minWidth: 320, maxWidth: 600, mx: "auto", textAlign: "left" }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Conversational AI Agents for Your Business
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
            Enhance your customer experience with intelligent automation
          </Typography>
          We offer custom conversational AI agents powered by{" "}
          <a
            href="https://elevenlabs.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            ElevenLabs
          </a>{" "}
          that can be seamlessly integrated into your business website or phone
          system.
          <ul>
            Our AI agents can:
            <li>Engage website visitors and answer their questions 24/7</li>
            <li>Handle incoming phone calls and provide instant support</li>
            <li>
              Make outgoing calls to assist with sales, reminders, or customer
              follow-ups
            </li>
            <li>
              Automate routine tasks and free up your team for higher-value work
            </li>
          </ul>
          Let us help you boost efficiency, improve customer satisfaction, and
          grow your business with state-of-the-art AI solutions.
        </CardContent>
        <CardActions>
          <Button
            size="large"
            variant="contained"
            color="primary"
            href="mailto:azhidkov@gmail.com?subject=Conversational%20AI%20Agent%20Inquiry"
          >
            Contact Us
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
