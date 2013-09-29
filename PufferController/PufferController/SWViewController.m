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

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)p1FireButtonTouched:(id)sender {
    [self makeRequestFireP1:1 fireP2:0 fireP3:0 fireP4:0 fireP5:0];
}

- (IBAction)p2FireButtonTouched:(id)sender {
    [self makeRequestFireP1:0 fireP2:1 fireP3:0 fireP4:0 fireP5:0];
}

- (IBAction)p3FireButtonTouched:(id)sender {
    [self makeRequestFireP1:0 fireP2:0 fireP3:1 fireP4:0 fireP5:0];
}

- (IBAction)p4FireButtonTouched:(id)sender {
    [self makeRequestFireP1:0 fireP2:0 fireP3:0 fireP4:1 fireP5:0];
}

- (IBAction)p5FireButtonTouched:(id)sender {
    [self makeRequestFireP1:0 fireP2:0 fireP3:0 fireP4:0 fireP5:1];
}

- (IBAction)allFireButtonTouched:(id)sender {
    [self makeRequestFireP1:1 fireP2:1 fireP3:1 fireP4:1 fireP5:1];
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
