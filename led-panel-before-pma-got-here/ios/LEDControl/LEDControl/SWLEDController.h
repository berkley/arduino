//
//  SWLEDController.h
//  LEDControl
//
//  Created by Chad Berkley on 7/24/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SWRadThingController.h"
/*
 controller for REST and WebSocket based LED controls
 */
@interface SWLEDController : SWRadThingController
{
}
@property (readonly) NSInteger numRows; //the number of rows in the array
@property (readonly) NSInteger numCols; //the number of rows in the array
@property (readonly) NSInteger numPanels; //the number of rows in the array

+ (SWLEDController*)instance;
- (void)setPixel:(NSInteger)pixel red:(NSInteger)r green:(NSInteger)g blue:(NSInteger)b;
- (void)setPixelx:(NSInteger)x y:(NSInteger)y red:(NSInteger)r green:(NSInteger)g blue:(NSInteger)b;
- (void)setRow:(NSInteger)row red:(NSInteger)r green:(NSInteger)g blue:(NSInteger)b;
- (void)setCol:(NSInteger)col red:(NSInteger)r green:(NSInteger)g blue:(NSInteger)b;
- (void)setScreen:(NSInteger)screen red:(NSInteger)r green:(NSInteger)g blue:(NSInteger)b;
- (void)setAllOff;
- (void)latch;

@end
