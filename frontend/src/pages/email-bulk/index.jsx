import { useState, Fragment } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import { 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Typography 
} from '@mui/material';
import Cookies from 'js-cookie';

import MailTemplate from './mailTemplate';
import MailBulkForm from './MailBulkForm';
import MailBulkDetail from './MailBulkDetail';

const steps = ['Mail Template Customization', 'Mail Bulk Creation', 'Mail Bulk Controlling'];

export default function MailBulkSteps() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
  const [mailBulkId, setMailBulkId] = useState(null);
  
  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    
    window.location.href = '/login';
  };

  const isStepOptional = (step) => {
    return step === 0;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '60%', margin: 'auto', padding: '50px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, position: 'fixed', left: 10, top: 10, }}>
        <Button 
          variant="outlined" 
          color="error" 
          startIcon={<LogoutIcon />} 
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </Fragment>
      ) : (
        <Fragment>
          {activeStep === 0 && (
            <Typography sx={{ mt: 2, mb: 1 }}>
              <MailTemplate onSelectTemplate={setSelectedTemplateId} />
            </Typography>
          )}
          {activeStep === 1 && (
            <Typography sx={{ mt: 2, mb: 1 }}>
              <MailBulkForm 
                selectedTemplateId={selectedTemplateId} 
                onSuccess={(id) => {
                  setMailBulkId(id);
                  setTimeout(() => {
                    handleNext();
                  }, 1000);
                }} 
              />
            </Typography>
          )}
          {activeStep === 2 && (
            <Typography sx={{ mt: 2, mb: 1 }}>
              <MailBulkDetail mailBulkId={mailBulkId} />
            </Typography>
          )}
          <Box sx={{
            width: '55%',
            display: 'flex', 
            flexDirection: 'row', 
            pt: 1,
            position: 'fixed', 
            bottom: 10, 
            left: '50%', 
            transform: 'translateX(-50%)',
            backgroundColor: '#fff',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Fragment>
      )}
    </Box>
  );
}
