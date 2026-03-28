import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ({ items }: { items: FAQItem[] }) {
  return (
    <Box className="mb-16 max-w-6xl mx-auto px-4">
      <Typography variant="h5" className="font-bold mb-6">
        Frequently Asked Questions
      </Typography>
      
      {items.map((item, idx) => (
        <Accordion key={idx} className="mb-4">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className="font-semibold">{item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" className="text-gray-700">
              {item.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
