import { useState } from "react";

import { Paper } from "@mui/material";

import SongDialog from "./SongDialog";
import { makeStyles } from '@material-ui/core/styles';

export type SongProps = {
  id: string;
  title: string;
  singer: string;
  listId: string;
  link: string;
};

export const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr', // 三等分
    gap: '16px', // 可選，設定列之間的間距
    textAlign: 'center', // 水平置中
    width: '100%', // 初始寬度為 100%
  },
  text: {
    padding: '8px', // 可選，設定文字內容的間距
  },
  sharedPaper: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '4px', // 或者使用 Tailwind 的 gap 類別
    width: '100%', // 初始寬度為 100%
  },
}));

export default function Song({ id, title, singer, listId, link }: SongProps) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Paper className={classes.sharedPaper} elevation={6}>
        <div className={classes.container}>
          <button onClick={handleClickOpen} className={classes.text}>
            {title}
          </button>
          <button onClick={handleClickOpen} className={classes.text}>
            {singer}
          </button>
          <a className={classes.text}  href={link} target="_blank" rel="noopener noreferrer">{link}</a>
        </div>
      </Paper>
      <SongDialog
        variant="edit"
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        singer={singer}
        listId={listId}
        songId={id}
        link={link}
      />
    </>
  );
}
