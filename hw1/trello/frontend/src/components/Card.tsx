import { useState } from "react";
import * as React from "react";
import { Grid, Chip, Box } from "@mui/material";
import Cardd from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


import CardDialog from "./CardDialog";

export type CardProps = {
  id: string;
  title: string;
  description: string;
  date: string;
  tag: string;
  mood: string;
  // listId: string;
};

export default function Card({ id, title, description, date, tag, mood }: CardProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const theCard = (
    <React.Fragment>
      <CardContent>
        <Grid>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Typography sx={{ mb: 1}}>
            {date}
          </Typography>
        </Grid>
        <Chip label={tag} color="primary"/>
        <Chip label={mood} color="secondary"/>
        <Typography sx={{ mb: 5 }} color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </React.Fragment>
  );
  return (
    <>
      <button onClick={handleClickOpen} className="text-start">
        <Box sx={{width:150, maxHeight: 100}}>
          <Cardd variant="outlined" sx={{width:250, maxHeight: 200}}>{theCard}</Cardd>
        </Box>    
      </button>
      <CardDialog
        variant="edit"
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        description={description}
        date={date}
        tag={tag}
        mood={mood}
        cardId={id}
      />
    </>
  );
}
