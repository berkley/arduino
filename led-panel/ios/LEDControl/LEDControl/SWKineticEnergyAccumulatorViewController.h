//
//  SWKineticEnergyAccumulatorViewController.h
//  LEDControl
//
//  Created by Chad Berkley on 7/30/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SWGyroViewController.h"

@interface SWKineticEnergyAccumulatorViewController : SWGyroViewController
{

}

@property (weak, nonatomic) IBOutlet UILabel *yawLabel;
@property (weak, nonatomic) IBOutlet UILabel *pitchLabel;
@property (weak, nonatomic) IBOutlet UILabel *rollLabel;

@property (weak, nonatomic) IBOutlet UILabel *rLabel;
@property (weak, nonatomic) IBOutlet UILabel *gLabel;
@property (weak, nonatomic) IBOutlet UILabel *bLabel;

@property (weak, nonatomic) IBOutlet UILabel *accelXLabel;
@property (weak, nonatomic) IBOutlet UILabel *accelYLabel;
@property (weak, nonatomic) IBOutlet UILabel *accelZLabel;
@property (weak, nonatomic) IBOutlet UILabel *accumLabel;
@property (weak, nonatomic) IBOutlet UILabel *goalLabel;
@property (weak, nonatomic) IBOutlet UILabel *rowLabel;

@property (weak, nonatomic) IBOutlet UIButton *screen2Button;
@property (weak, nonatomic) IBOutlet UIButton *screen1Button;
@property (weak, nonatomic) IBOutlet UIButton *screen3Button;
@property (weak, nonatomic) IBOutlet UIButton *screenAllButton;

@property (weak, nonatomic) IBOutlet UIButton *pauseButton;

@end
