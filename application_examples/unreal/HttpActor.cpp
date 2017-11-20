// Fill out your copyright notice in the Description page of Project Settings.

#include "HttpActor.h"
#include "Json.h"

// Sets default values
AHttpActor::AHttpActor()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = false;

	Http = &FHttpModule::Get();
}

// Called when the game starts or when spawned
void AHttpActor::BeginPlay()
{
	Super::BeginPlay();

}

// Called every frame
void AHttpActor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}

// Get All Matches http call
void AHttpActor::HttpGetAllMatches()
{
	TSharedRef<IHttpRequest> Request = Http->CreateRequest();
	Request->OnProcessRequestComplete().BindUObject(this, &AHttpActor::OnHttpGetResponseReceived);
	Request->SetURL(TEXT("http://up.imt.hig.no:8333/matches/no_body/" + GameToken));
	Request->SetVerb("GET");
	Request->ProcessRequest();
}

// Get All Non Full Matches http call
void AHttpActor::HttpGetAllNonFullMatches()
{
	TSharedRef<IHttpRequest> Request = Http->CreateRequest();
	Request->OnProcessRequestComplete().BindUObject(this, &AHttpActor::OnHttpGetResponseReceived);
	Request->SetURL(TEXT("http://up.imt.hig.no:8333/matches/not_full/no_body/" + GameToken));
	Request->SetVerb("GET");
	Request->ProcessRequest();
}

// Get All Matches In Session http call
void AHttpActor::HttpGetAllMatchesInSession()
{
	TSharedRef<IHttpRequest> Request = Http->CreateRequest();
	Request->OnProcessRequestComplete().BindUObject(this, &AHttpActor::OnHttpGetResponseReceived);
	Request->SetURL(TEXT("http://up.imt.hig.no:8333/matches/in_session/no_body/" + GameToken));
	Request->SetVerb("GET");
	Request->ProcessRequest();
}

// Get All Matches Not In Session http call
void AHttpActor::HttpGetAllMatchesNotInSession()
{
	TSharedRef<IHttpRequest> Request = Http->CreateRequest();
	Request->OnProcessRequestComplete().BindUObject(this, &AHttpActor::OnHttpGetResponseReceived);
	Request->SetURL(TEXT("http://up.imt.hig.no:8333/matches/not_in_session/no_body/" + GameToken));
	Request->SetVerb("GET");
	Request->ProcessRequest();
}

// Get Match By Id http call
void AHttpActor::HttpGetMatchById(FString MatchId)
{
	FString MatchIdAsJsonString = FString::Printf(TEXT("{ \"id\": \"%s\" }"), *MatchId);

	TSharedRef<IHttpRequest> Request = Http->CreateRequest();
	Request->OnProcessRequestComplete().BindUObject(this, &AHttpActor::OnHttpGetMatchResponseRecived);
	Request->SetURL(TEXT("http://up.imt.hig.no:8333/match/"));
	Request->SetVerb("GET");
	Request->SetHeader("Content-Type", "application/json");
	Request->SetContentAsString(MatchIdAsJsonString);
	Request->ProcessRequest();
}

// Create Match http call
void AHttpActor::HttpCreateMatch(FNewMatchData MatchData)
{
	FString MatchDataAsJsonString = FString::Printf(TEXT("{ \"name\": \"%s\", \"gameToken\": \"%s\", \"hostIP\": \"%s\", \"hostPort\": %i, \"maxPlayerCount\": %i }"),
										 *MatchData.Name,
										 *MatchData.GameToken,
										 *MatchData.HostIP,
										 MatchData.HostPort,
										 MatchData.MaxPlayerCount);

	TSharedRef<IHttpRequest> Request = Http->CreateRequest();
	Request->OnProcessRequestComplete().BindUObject(this, &AHttpActor::OnHttpCreateMatchResponseRecived);
	Request->SetURL(TEXT("http://up.imt.hig.no:8333/match/"));
	Request->SetVerb("POST");
	Request->SetHeader("Content-Type", "application/json");
	Request->SetContentAsString(MatchDataAsJsonString);
	Request->ProcessRequest();
}

// Delete Match http call
void AHttpActor::HttpDeleteMatch(FString MatchId)
{
	FString MatchIdAsJsonString = FString::Printf(TEXT("{ \"id\": \"%s\" }"), *MatchId);

	TSharedRef<IHttpRequest> Request = Http->CreateRequest();
	Request->OnProcessRequestComplete().BindUObject(this, &AHttpActor::OnHttpDeleteMatchResponseRecived);
	Request->SetURL(TEXT("http://up.imt.hig.no:8333/match/"));
	Request->SetVerb("DELETE");
	Request->SetHeader("Content-Type", "application/json");
	Request->SetContentAsString(MatchIdAsJsonString);
	Request->ProcessRequest();
}

// Update player count
void AHttpActor::HttpUpdatePlayerCount(FString MatchId, int NewPlayerCount)
{
	FString MatchDataAsJsonString = FString::Printf(TEXT("{ \"id\": \"%s\", \"playerCount\": %i }"), *MatchId, NewPlayerCount);

	TSharedRef<IHttpRequest> Request = Http->CreateRequest();
	Request->OnProcessRequestComplete().BindUObject(this, &AHttpActor::OnHttpUpdatePlayerCountResponseRecived);
	Request->SetURL(TEXT("http://up.imt.hig.no:8333/match/player_count/"));
	Request->SetVerb("PUT");
	Request->SetHeader("Content-Type", "application/json");
	Request->SetContentAsString(MatchDataAsJsonString);
	Request->ProcessRequest();
}

// Update match status
void AHttpActor::HttpUpdateMatchStatus(FString MatchId, int MatchStatus)
{
	FString MatchDataAsJsonString = FString::Printf(TEXT("{ \"id\": \"%s\", \"status\": %i }"), *MatchId, MatchStatus);

	TSharedRef<IHttpRequest> Request = Http->CreateRequest();
	Request->OnProcessRequestComplete().BindUObject(this, &AHttpActor::OnHttpUpdateMatchStatusResponseRecived);
	Request->SetURL(TEXT("http://up.imt.hig.no:8333/match/status/"));
	Request->SetVerb("PUT");
	Request->SetHeader("Content-Type", "application/json");
	Request->SetContentAsString(MatchDataAsJsonString);
	Request->ProcessRequest();
}

// Send Match Report http call
void AHttpActor::HttpSendMatchReport(FString MatchId, FString MatchReport)
{
	FString MatchReportAsJsonString = FString::Printf(TEXT("{ \"_id\": \"%s\", \"gameToken\": \"%s\", \"data\": \"%s\" }"), *MatchId, *GameToken, *MatchReport);

	TSharedRef<IHttpRequest> Request = Http->CreateRequest();
	Request->OnProcessRequestComplete().BindUObject(this, &AHttpActor::OnHttpSendMatchReportResponseRecived);
	Request->SetURL(TEXT("http://up.imt.hig.no:8333/match_report/"));
	Request->SetVerb("POST");
	Request->SetHeader("Content-Type", "application/json");
	Request->SetContentAsString(MatchReportAsJsonString);
	Request->ProcessRequest();
}

// Get Matches http call response
void AHttpActor::OnHttpGetResponseReceived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful)
{
	if (bWasSuccessful)
	{
		//Create a pointer to hold the json serialized data
		TSharedPtr<FJsonValue> JsonValue;
		
		//Create a reader pointer to read the json data
		TSharedRef<TJsonReader<TCHAR>> Reader = TJsonReaderFactory<TCHAR>::Create(*Response->GetContentAsString());
		
		//Deserialize the json data given Reader and the actual object to deserialize
		if (FJsonSerializer::Deserialize(Reader, JsonValue))
		{
			TArray<TSharedPtr<FJsonValue>> ObjArray = JsonValue->AsArray();
			for (int i = 0; i < ObjArray.Num(); i++)
			{
				FGameData NewGameData;
				NewGameData.Id = ObjArray[i]->AsObject()->GetStringField("_id");
				NewGameData.GameToken = ObjArray[i]->AsObject()->GetStringField("gameToken");
				NewGameData.Name = ObjArray[i]->AsObject()->GetStringField("name");
				NewGameData.HostIP = ObjArray[i]->AsObject()->GetStringField("hostIP");
				NewGameData.HostPort = ObjArray[i]->AsObject()->GetIntegerField("hostPort");
				NewGameData.VersionNumber = ObjArray[i]->AsObject()->GetIntegerField("__v");
				NewGameData.LastModified = ObjArray[i]->AsObject()->GetStringField("lastModified");
				NewGameData.MiscInfo = ObjArray[i]->AsObject()->GetStringField("miscInfo");
				NewGameData.MaxPlayerCount = ObjArray[i]->AsObject()->GetIntegerField("maxPlayerCount");
				NewGameData.PlayerCount = ObjArray[i]->AsObject()->GetIntegerField("playerCount");
				NewGameData.Status = ObjArray[i]->AsObject()->GetIntegerField("status");

				// Get Matches call was successfull, and each of the found matches will be temporarily stored in NewGameData
			}
		}
		else
		{
			UE_LOG(LogTemp, Warning, TEXT("Json Deserializer failed in \"OnHttpGetResponseReceived\""));
			UE_LOG(LogTemp, Warning, TEXT("Response Code: %i"), Response->GetResponseCode());
			UE_LOG(LogTemp, Warning, TEXT("Http GET request failed, json object: %s"), *Response->GetContentAsString());
		}
	}
	else
	{
		UE_LOG(LogTemp, Warning, TEXT("Http GET request was not successfull"));
	}
}

// Create Match By Id http call response
void AHttpActor::OnHttpGetMatchResponseRecived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful)
{
	if (bWasSuccessful)
	{
		//Create a pointer to hold the json serialized data
		TSharedPtr<FJsonObject> JsonObject;

		//Create a reader pointer to read the json data
		TSharedRef<TJsonReader<TCHAR>> Reader = TJsonReaderFactory<TCHAR>::Create(*Response->GetContentAsString());

		//Deserialize the json data given Reader and the actual object to deserialize
		if (FJsonSerializer::Deserialize(Reader, JsonObject))
		{
			FGameData NewGameData;
			NewGameData.Id = JsonObject->GetStringField("_id");
			NewGameData.GameToken = JsonObject->GetStringField("gameToken");
			NewGameData.Name = JsonObject->GetStringField("name");
			NewGameData.HostIP = JsonObject->GetStringField("hostIP");
			NewGameData.HostPort = JsonObject->GetIntegerField("hostPort");
			NewGameData.VersionNumber = JsonObject->GetIntegerField("__v");
			NewGameData.PlayerCount = JsonObject->GetIntegerField("playerCount");
			NewGameData.Status = JsonObject->GetIntegerField("status");

			// Get Match call was successfull, and the match data is stored in NewGameData
		}
		else
		{
			UE_LOG(LogTemp, Warning, TEXT("Json Deserializer failed in \"OnHttpGetMatchResponseRecived\""));
			UE_LOG(LogTemp, Warning, TEXT("Response Code: %i"), Response->GetResponseCode());
			UE_LOG(LogTemp, Warning, TEXT("Http GET request failed, json object: %s"), *Response->GetContentAsString());
		}
	}
	else
	{
		UE_LOG(LogTemp, Warning, TEXT("Http GET request was not successfull"));
	}
}

// Create Match http call response
void AHttpActor::OnHttpCreateMatchResponseRecived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful)
{
	if (bWasSuccessful)
	{
		//Create a pointer to hold the json serialized data
		TSharedPtr<FJsonObject> JsonObject;
		
		//Create a reader pointer to read the json data
		TSharedRef<TJsonReader<TCHAR>> Reader = TJsonReaderFactory<TCHAR>::Create(*Response->GetContentAsString());
		
		//Deserialize the json data given Reader and the actual object to deserialize
		if (FJsonSerializer::Deserialize(Reader, JsonObject))
		{
			FGameData NewGameData;
			NewGameData.Id = JsonObject->GetStringField("_id");
			NewGameData.GameToken =	JsonObject->GetStringField("gameToken");
			NewGameData.Name = JsonObject->GetStringField("name");
			NewGameData.HostIP = JsonObject->GetStringField("hostIP");
			NewGameData.HostPort = JsonObject->GetIntegerField("hostPort");
			NewGameData.VersionNumber = JsonObject->GetIntegerField("__v");
			NewGameData.PlayerCount = JsonObject->GetIntegerField("playerCount");
			NewGameData.Status = JsonObject->GetIntegerField("status");

			// Create Match call was successfull, and the new match info is stored in NewGameData
		}
		else
		{
			UE_LOG(LogTemp, Warning, TEXT("Json Deserializer failed in \"OnHttpCreateMatchResponseRecived\""));
			UE_LOG(LogTemp, Warning, TEXT("Response Code: %i"), Response->GetResponseCode());
			UE_LOG(LogTemp, Warning, TEXT("Http POST request failed, json object: %s"), *Response->GetContentAsString());
		}
	}
	else
	{
		UE_LOG(LogTemp, Warning, TEXT("Http POST request was not successfull"));
	}
}

// Delete Match http call response
void AHttpActor::OnHttpDeleteMatchResponseRecived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful)
{
	if (bWasSuccessful)
	{
		int32 ResponseCode = Response->GetResponseCode();
		if (ResponseCode == 204)
		{
			// Delete request was successfull
		}
		else if (ResponseCode == 404)
		{
			// No match found at the gived Id
		}
	}
	else
	{
		UE_LOG(LogTemp, Warning, TEXT("Http DELETE request was not successfull"));
	}
}

// Update Player Count http call response
void AHttpActor::OnHttpUpdatePlayerCountResponseRecived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful)
{
	if (bWasSuccessful)
	{
		int32 ResponseCode = Response->GetResponseCode();

		if (ResponseCode == 204)
		{
			// Put request was successfull
		}
		else if (ResponseCode == 400)
		{
			// The supplied player count did not adhere to the limits
		}
		else if (ResponseCode == 404)
		{
			// No match found at the gived Id
		}
	}
	else
	{
		UE_LOG(LogTemp, Warning, TEXT("Http PUT request was not successfull"));
	}
}

// Update Match Status http call response
void AHttpActor::OnHttpUpdateMatchStatusResponseRecived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful)
{
	if (bWasSuccessful)
	{
		int32 ResponseCode = Response->GetResponseCode();

		if (ResponseCode == 204)
		{
			// Put request was successfull
		}
		else if (ResponseCode == 404)
		{
			// No match found at the gived Id
		}
	}
	else
	{
		UE_LOG(LogTemp, Warning, TEXT("Http PUT request was not successfull"));
	}
}

// Send Match Report http call response
void AHttpActor::OnHttpSendMatchReportResponseRecived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful)
{
	if (bWasSuccessful)
	{
		int32 ResponseCode = Response->GetResponseCode();
		if (ResponseCode == 200)
		{
			// Post request was successfull
		}
		else if (ResponseCode == 403)
		{
			// Invalid game token provided
		}
	}
	else
	{
		UE_LOG(LogTemp, Warning, TEXT("Http POST request was not successfull"));
	}
}