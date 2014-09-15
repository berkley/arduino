

- (void)prepareForSegue...

// parse name from segue
if ([seque.name isEqualToString])


// shuffle: 
// choose random number, select from array of names

NSInteger index = arc4rand() % NUM_THINGS;
NSString *thingName = [things objectAtIndex:index];

SWWebCSViewController *cs = (SWWebCSViewController*)segue.destinationViewController;

cs.name = thingName;


