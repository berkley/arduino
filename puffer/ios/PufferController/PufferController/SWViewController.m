//
//  SWViewController.m
//  PufferController
//
//  Created by Chad Berkley on 9/28/13.
//  Copyright (c) 2013 Chad Berkley. All rights reserved.
//

#import "SWViewController.h"

@interface SWViewController ()

@end

@implementation SWViewController

int p1, p2, p3, p4, p5;

- (void)viewDidLoad
{
    [super viewDidLoad];
    p1 = 0;
    p2 = 0;
    p3 = 0;
    p4 = 0;
    p5 = 0;
}

- (IBAction)p1FireButtonTouched:(id)sender {
    p1 = 1;
    [self updateAll];
}

- (IBAction)p1FireButtonReleased:(id)sender {
    p1 = 0;
    [self updateAll];
}

- (IBAction)p2FireButtonTouched:(id)sender {
    p2 = 1;
    [self updateAll];
}

- (IBAction)p2FireButtonReleased:(id)sender {
    p2 = 0;
    [self updateAll];
}

- (IBAction)p3FireButtonTouched:(id)sender {
    p3 = 1;
    [self updateAll];
}

- (IBAction)p3FireButtonReleased:(id)sender {
    p3 = 0;
    [self updateAll];

}

- (IBAction)p4FireButtonTouched:(id)sender {
    p4 = 1;
    [self updateAll];
}

- (IBAction)p4FireButtonReleased:(id)sender {
    p4 = 0;
    [self updateAll];
}

- (IBAction)p5FireButtonTouched:(id)sender {
    p5 = 1;
    [self updateAll];
}

- (IBAction)p5FireButtonReleased:(id)sender {
    p5 = 0;
    [self updateAll];
}

- (IBAction)allFireButtonTouched:(id)sender {
    p1 = 1;
    p2 = 1;
    p3 = 1;
    p4 = 1;
    p5 = 1;
    [self updateAll];
}

- (IBAction)fireAllButtonReleased:(id)sender {
    p1 = 0;
    p2 = 0;
    p3 = 0;
    p4 = 0;
    p5 = 0;
    [self updateAll];
}

- (void)updateAll
{
    [self makeRequestFireP1:p1 fireP2:p2 fireP3:p3 fireP4:p4 fireP5:p5];
}


- (void)makeRequestFireP1:(BOOL)p1
                   fireP2:(BOOL)p2
                   fireP3:(BOOL)p3
                   fireP4:(BOOL)p4
                   fireP5:(BOOL)p5
{
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc]
                                    initWithURL:[NSURL
                                                 URLWithString:@"http://localhost:5000/puff"]];
    
    [request setHTTPMethod:@"POST"];
    [request setValue:@"application/json"
   forHTTPHeaderField:@"Content-type"];
    
    NSString *jsonString = [NSString stringWithFormat:@"{\"puffer1\":%i, \"puffer2\":%i, \"puffer3\":%i, \"puffer4\":%i, \"puffer5\":%i}", p1, p2, p3, p4, p5];
    
    [request setValue:[NSString stringWithFormat:@"%d",
                       [jsonString length]]
   forHTTPHeaderField:@"Content-length"];
    
    [request setHTTPBody:[jsonString
                          dataUsingEncoding:NSUTF8StringEncoding]];
    
    [[NSURLConnection alloc] 
     initWithRequest:request 
     delegate:self];
}

@end
