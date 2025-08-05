import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Log } from '../log';
const TOKEN = "YOUR_ACCESS_TOKEN";

export default function StatsPage() {
  React.useEffect(() => {
    Log("frontend", "info", "stats", "Visited statistics page", TOKEN);
  }, []);

  let urls = JSON.parse(localStorage.getItem('shortUrls') || '{}');
  let keys = Object.keys(urls);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h4" mb={3}>Statistics</Typography>
      {keys.length === 0 ? (
        <Typography>No URLs shortened yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Short URL</TableCell>
                <TableCell>Original URL</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Expiry</TableCell>
                <TableCell>Clicks</TableCell>
                <TableCell>Click Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keys.map(sc => (
                <TableRow key={sc}>
                  <TableCell>
                    <a href={`/${sc}`} target="_blank" rel="noreferrer">{window.location.origin}/{sc}</a>
                  </TableCell>
                  <TableCell sx={{ wordBreak: "break-all" }}>{urls[sc].originalUrl}</TableCell>
                  <TableCell>{new Date(urls[sc].created).toLocaleString()}</TableCell>
                  <TableCell>{new Date(urls[sc].expiry).toLocaleString()}</TableCell>
                  <TableCell>{urls[sc].clicks || 0}</TableCell>
                  <TableCell>
                    {urls[sc].clickDetails && urls[sc].clickDetails.length > 0 ? (
                      <ul>
                        {urls[sc].clickDetails.map((d,i) =>
                          <li key={i}>{d.time + " (" + d.source + ")"}</li>
                        )}
                      </ul>
                    ) : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
